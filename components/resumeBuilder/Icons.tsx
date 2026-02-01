import React from "react";
import { Svg, Path, Circle } from "@react-pdf/renderer";

interface IconProps {
  size?: number;
  color?: string;
}

export const PhoneIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
      fill={color}
    />
  </Svg>
);

export const EmailIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      fill={color}
    />
  </Svg>
);

export const LocationIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill={color}
    />
  </Svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#0077b5",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
      fill={color}
    />
  </Svg>
);

export const GitHubIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#333",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
      fill={color}
    />
  </Svg>
);

export const WebsiteIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
      fill={color}
    />
  </Svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
      fill={color}
    />
  </Svg>
);

export const GraduationIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
      fill={color}
    />
  </Svg>
);

export const CodeIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
      fill={color}
    />
  </Svg>
);

export const ToolsIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
      fill={color}
    />
  </Svg>
);

export const ProjectIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
      fill={color}
    />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill={color}
    />
  </Svg>
);

export const LightningIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 2v11h3v9l7-12h-4l4-8z" fill={color} />
  </Svg>
);

export const TargetIcon: React.FC<IconProps> = ({
  size = 10,
  color = "#2c3e50",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="5" fill={color} />
  </Svg>
);
