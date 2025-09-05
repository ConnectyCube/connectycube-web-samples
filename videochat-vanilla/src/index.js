import Alpine from 'alpinejs';
import { toast, ui, users } from './store';
import App from './app';
import { createIcons, LogOut, Mic, MicOff, Phone, PhoneOff, ScreenShare, ScreenShareOff, SwitchCamera, Video, VideoOff } from 'lucide';

Alpine.store("toast", toast);
Alpine.store("users", users);
Alpine.store("ui", ui);

Alpine.data('app', () => new App());

Alpine.start();

createIcons({
  icons: {
    LogOut,
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    SwitchCamera,
    ScreenShare,
    ScreenShareOff,
    Video,
    VideoOff,
  }
});