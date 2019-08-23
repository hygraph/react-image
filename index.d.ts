import React from 'react';

type ClassName = string | Object;

export interface GraphImageProp {
  handle: string;
  height: number;
  width: number;
}

export interface GraphImageProps {
  title?: string;
  alt?: string;
  className?: ClassName;
  outerWrapperClassName?: ClassName;
  style?: Object;
  image: GraphImageProp;
  fit?: 'clip' | 'crop' | 'scale' | 'max';
  maxWidth?: number;
  withWebp?: boolean;
  transforms?: string[];
  onLoad?: Function;
  blurryPlaceholder?: boolean;
  backgroundColor?: string | boolean;
  fadeIn?: boolean;
  baseURI?: string;
}

export default class GraphImage extends React.Component<GraphImageProps> {}
