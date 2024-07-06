export interface IconsMap {
	[key: string]: {
		name: string;
		uri: {
			light: string;
			dark: string;
		};
		info: { height: number; width: number; ratio: number; type: string };
	};
}
