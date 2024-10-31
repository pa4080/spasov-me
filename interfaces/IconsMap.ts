export type IconsMap = Record<
  string,
  {
    name: string;
    uri: {
      light: string;
      dark: string;
    };
    info: { height: number; width: number; ratio: number; type: string };
  }
>;
