import {ListRange} from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

type ItemHeight = number[];
type Range = [number, number];
const intersects = (a: Range, b: Range): boolean =>
  (a[0] <= b[0] && b[0] <= a[1]) ||
  (a[0] <= b[1] && b[1] <= a[1]) ||
  (b[0] < a[0] && a[1] < b[1]);
const clamp = (min: number, value: number, max: number): number =>
  Math.min(Math.max(min, value), max);
const isEqual = <T>(a: T, b: T) => a === b;
const last = <T>(value: T[]): T => value[value.length - 1];

export class CustomVirtualScrollStrategy implements VirtualScrollStrategy {
  constructor(private itemHeights: ItemHeight) {
  }

  private viewport?: CdkVirtualScrollViewport;
  private scrolledIndexChange$ = new Subject<number>();
  public scrolledIndexChange: Observable<number> =
    this.scrolledIndexChange$.pipe(distinctUntilChanged());
  _minBufferPx = 100;
  _maxBufferPx = 100;

  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  detach() {
    this.scrolledIndexChange$.complete();
    delete this.viewport;
  }

  public updateItemHeights(itemHeights: ItemHeight) {
    this.itemHeights = itemHeights;
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  private getItemOffset(index: number): number {
    let res = this.itemHeights
      .slice(0, index)
      .reduce((acc, itemHeight) => acc + itemHeight, 0);

    // console.log('getItemOffset', index, res);
    return res;
  }

  private getTotalContentSize(): number {
    return this.itemHeights.reduce((a, b) => a + b, 0);
  }

  private getListRangeAt(
    scrollOffset: number,
    viewportSize: number
  ): ListRange {
    type Acc = { itemIndexesInRange: number[]; currentOffset: number };
    const visibleOffsetRange: Range = [
      scrollOffset,
      scrollOffset + viewportSize,
    ];
    const itemsInRange = this.itemHeights.reduce<Acc>(
      (acc, itemHeight, index) => {
        const itemOffsetRange: Range = [
          acc.currentOffset,
          acc.currentOffset + itemHeight,
        ];
        return {
          currentOffset: acc.currentOffset + itemHeight,
          itemIndexesInRange: intersects(itemOffsetRange, visibleOffsetRange)
            ? [...acc.itemIndexesInRange, index]
            : acc.itemIndexesInRange,
        };
      },
      {itemIndexesInRange: [], currentOffset: 0}
    ).itemIndexesInRange;
    const BUFFER_BEFORE = 5;
    const BUFFER_AFTER = 5;
    return {
      start: clamp(
        0,
        (itemsInRange[0] ?? 0) - BUFFER_BEFORE,
        this.itemHeights.length - 1
      ),
      end: clamp(
        0,
        (last(itemsInRange) ?? 0) + BUFFER_AFTER,
        this.itemHeights.length
      ),
    };
  }

  private updateRenderedRange() {
    if (!this.viewport) return;

    const viewportSize = this.viewport.getViewportSize();
    const scrollOffset = this.viewport.measureScrollOffset('top');

    // const scrollOffset2 = this.viewport.measureScrollOffset('bottom');
    // console.log(
    //   'getIupdateRenderedRangetemOffset',
    //   scrollOffset,
    //   scrollOffset2,
    //   viewportSize,
    //   newRange
    // );

    if (scrollOffset === 0) {
      // console.warn('WARN');
    }

    const newRange = this.getListRangeAt(scrollOffset, viewportSize);
    const oldRange = this.viewport?.getRenderedRange();

    if (isEqual(newRange, oldRange)) return;

    this.viewport.setRenderedRange(newRange);
    this.viewport.setRenderedContentOffset(this.getItemOffset(newRange.start));
    this.scrolledIndexChange$.next(newRange.start);

    // console.log('newRange', newRange, scrollOffset);
  }

  private updateTotalContentSize() {
    const contentSize = this.getTotalContentSize();
    // console.log('TOTAL', contentSize);
    // console.log(contentSize);
    this.viewport?.setTotalContentSize(contentSize);
  }

  onContentScrolled() {
    this.updateRenderedRange();
  }

  onDataLengthChanged() {
    // console.log('onDataLengthChanged');
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  onContentRendered() {
    //console.log("onContentRendered")
  }

  onRenderedOffsetChanged() {
  }

  scrollToIndex(index: number, behavior: ScrollBehavior) {
    this.viewport?.scrollToOffset(this.getItemOffset(index), behavior);
  }
}

function factory(dir: CustomVirtualScrollDirective) {
  return dir.scrollStrategy;
}

@Directive({
  selector: 'cdk-virtual-scroll-viewport[customVirtualScrollStrategy]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: factory,
      deps: [forwardRef(() => CustomVirtualScrollDirective)],
    },
  ],
})
export class CustomVirtualScrollDirective implements OnChanges {
  constructor(private elRef: ElementRef, private cd: ChangeDetectorRef) {
  }

  @Input() itemHeights: ItemHeight = [];
  scrollStrategy: CustomVirtualScrollStrategy = new CustomVirtualScrollStrategy(
    this.itemHeights
  );

  ngOnChanges(changes: SimpleChanges) {
    if ('itemHeights' in changes) {
      this.scrollStrategy.updateItemHeights(this.itemHeights);
      this.cd.detectChanges();
    }
  }
}
