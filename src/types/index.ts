export interface Channel {
  red: boolean;
  green: boolean;
  blue: boolean;
  alpha: boolean;
}

export interface ImageViewerState {
  channels: Channel;
  zoom: number;
  position: { x: number; y: number };
  rotation: number;
}

export interface TabConfig {
  id: string;
  title: string;
  imageUrl: string;
  imageFile?: File;
  state: ImageViewerState;
}
