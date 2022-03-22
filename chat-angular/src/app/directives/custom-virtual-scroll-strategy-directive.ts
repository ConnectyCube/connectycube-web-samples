import { ListRange } from '@angular/cdk/collections'
import { CdkVirtualScrollViewport, VirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling'
import { ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

type ItemHeight = number[]
type Range = [number, number]
const intersects = (a: Range, b: Range): boolean => (
  (a[0] <= b[0] && b[0] <= a[1]) ||
  (a[0] <= b[1] && b[1] <= a[1]) ||
  (b[0] < a[0] && a[1] < b[1])
)
const clamp = (min: number, value: number, max: number): number => Math.min(Math.max(min, value), max)
const isEqual = <T>(a: T, b: T) => a === b
const last = <T>(value: T[]): T => value[value.length-1]

export function factory (dir: CustomVirtualScrollDirective) {
  return dir.scrollStrategy
}

@Directive({
  selector: 'cdk-virtual-scroll-viewport[customVirtualScrollStrategy]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: factory,
    deps: [forwardRef(() => CustomVirtualScrollDirective)]
  }],
})
export class CustomVirtualScrollDirective implements OnChanges {
  constructor(private elRef: ElementRef, private cd: ChangeDetectorRef) {}
  @Input() itemHeights: ItemHeight = []
  @Input() convTarget: string;
  scrollStrategy: CustomVirtualScrollStrategy = new CustomVirtualScrollStrategy(this.itemHeights)
  ngOnChanges(changes: SimpleChanges) {
    if ('convTarget' in changes) {
      this.scrollStrategy.onNewChat(this.convTarget);
    }

    if ('itemHeights' in changes) {
      console.log("[CustomVirtualScrollStrategy][CustomVirtualScrollDirective][ngOnChanges]", changes)
      this.scrollStrategy.updateItemHeights(this.itemHeights)
      this.cd.detectChanges()
    }
  }
}

export class CustomVirtualScrollStrategy implements VirtualScrollStrategy {
  constructor(private itemHeights: ItemHeight) {
    console.log("[CustomVirtualScrollStrategy][constructor]");
  }

  private viewport?: CdkVirtualScrollViewport
  private scrolledIndexChange$ = new Subject<number>()
  public scrolledIndexChange: Observable<number> = this.scrolledIndexChange$.pipe(distinctUntilChanged())

  _minBufferPx = 100
  _maxBufferPx = 100

  // isDataLengthChanged = false;

  private _lastOffsetForIndexForOffset = -1;
  private _lastIndexForOffset = 0;

  attach(viewport: CdkVirtualScrollViewport) {
    console.log("[CustomVirtualScrollStrategy][attach]")

    this.viewport = viewport;
    this.updateTotalContentSize()
    this.updateRenderedRange()
  }

  detach() {
    this.scrolledIndexChange$.complete()
    delete this.viewport
  }

  public onNewChat(convTarget: string) {
    this._lastOffsetForIndexForOffset = -1;
    console.log("[CustomVirtualScrollStrategy][onNewChat]", convTarget);
  }

  public updateItemHeights(itemHeights: ItemHeight) {
    console.log("[CustomVirtualScrollStrategy][updateItemHeights]", this.itemHeights.length, '~>' ,itemHeights.length)

    // if (itemHeights.length !== this.itemHeights.length) {
    //   this.isDataLengthChanged = true;
    // }

    this.itemHeights = itemHeights
    this.updateTotalContentSize()
    this.updateRenderedRange()
  }

  private getItemOffset(index: number): number {
    return this.itemHeights.slice(0, index).reduce((acc, itemHeight) => acc + itemHeight, 0)
  }

  // TODO: optimize
  private getIndexForOffset(offset: number, viewportSize: number): number {

    // prevent from frequent calculations
    if (this._lastOffsetForIndexForOffset != -1 && Math.abs(this._lastOffsetForIndexForOffset - offset) < 200) {
      return this._lastIndexForOffset;
    }

    let index: number;

    let sum = 0;
    for (let i = 0; i < this.itemHeights.length; ++i) {
      sum = sum + this.itemHeights[i];
      // console.log("[CustomVirtualScrollStrategy][getIndexForOffset]1", i, this.itemHeights[i], sum, offset + viewportSize)
      if (sum > offset + viewportSize) {
        index = i - 1;
        break;
      }
    }
    // @ts-ignore
    if (!index) {
      index = this.itemHeights.length - 1;
    }

    // console.log("[CustomVirtualScrollStrategy][getIndexForOffset]", index, offset, viewportSize, index ? "" : [sum, offset + viewportSize])

    this._lastOffsetForIndexForOffset = offset;
    this._lastIndexForOffset = index || 0;

    return this._lastIndexForOffset
  }

  private getTotalContentSize(): number {
    return this.itemHeights.reduce((a,b)=>a+b, 0)
  }

  private getListRangeAt(scrollOffset: number, viewportSize: number): ListRange {
    type Acc = {itemIndexesInRange: number[], currentOffset: number}
    const visibleOffsetRange: Range = [scrollOffset, scrollOffset + viewportSize]
    const itemsInRange = this.itemHeights.reduce<Acc>((acc, itemHeight, index) => {
      const itemOffsetRange: Range = [acc.currentOffset, acc.currentOffset + itemHeight]
      return {
        currentOffset: acc.currentOffset + itemHeight,
        itemIndexesInRange: intersects(itemOffsetRange, visibleOffsetRange)
          ? [...acc.itemIndexesInRange, index]
          : acc.itemIndexesInRange
      }
    }, {itemIndexesInRange: [], currentOffset: 0}).itemIndexesInRange
    const BUFFER_BEFORE = 5
    const BUFFER_AFTER = 5
    return {
      start: clamp(0, (itemsInRange[0] ?? 0) - BUFFER_BEFORE, this.itemHeights.length - 1),
      end: clamp(0, (last(itemsInRange) ?? 0) + BUFFER_AFTER, this.itemHeights.length)
    }
  }

  private updateRenderedRange() {
    if (!this.viewport) return

    const viewportSize = this.viewport.getViewportSize();
    let scrollOffset = this.viewport.measureScrollOffset();


    // if (scrollOffset === 0) {
    //   console.warn('VSS JUMP RECOVERY');
    // }

    const newRange = this.getListRangeAt(scrollOffset, viewportSize)
    const oldRange = this.viewport?.getRenderedRange()

    // console.log("[CustomVirtualScrollStrategy][updateRenderedRange]", scrollOffset, viewportSize, newRange, oldRange);


    if (isEqual(newRange, oldRange)) return

    this.viewport.setRenderedRange(newRange);
    const itemOffset = this.getItemOffset(newRange.start);
    this.viewport.setRenderedContentOffset(itemOffset);

    const firstVisibleIndex = this.getIndexForOffset(scrollOffset, viewportSize);
    this.scrolledIndexChange$.next(firstVisibleIndex);

    // console.log("[CustomVirtualScrollStrategy][VSS] updateRenderedRange", newRange.start, newRange);
  }

  private updateTotalContentSize() {
    this.viewport?.setTotalContentSize(this.getTotalContentSize())
  }

  onContentScrolled() {
    // console.log("[CustomVirtualScrollStrategy][onContentScrolled]")
    this.updateRenderedRange()
  }

  onDataLengthChanged() {
    console.log("[CustomVirtualScrollStrategy][onDataLengthChanged]", this.itemHeights.length)
    this.updateTotalContentSize()
    this.updateRenderedRange()
  }

  // private scrollToBottom() {
  //   this.scrollToIndex(this.itemHeights.length - 1, "auto");
  //   console.log("[CustomVirtualScrollStrategy][scrollToBottom]", 0)
  // }

  onContentRendered() {

  }

  onRenderedOffsetChanged() {
    // console.log("[CustomVirtualScrollStrategy][onRenderedOffsetChanged]")
  }

  scrollToIndex(index: number, behavior: ScrollBehavior) {
    console.log("[CustomVirtualScrollStrategy][scrollToIndex]")
    this.viewport?.scrollToOffset(this.getItemOffset(index), behavior)
  }

  scrollToOffset(offset: number, behavior: ScrollBehavior) {
    console.log("[CustomVirtualScrollStrategy][scrollToOffset]", offset)
    this.viewport?.scrollToOffset(offset, behavior)
  }
}
