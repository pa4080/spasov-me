export interface IconMap {
	[key: string]: {
		name: string;
		uri: {
			light: string | null;
			dark: string | null;
		};
		info: { height: number; width: number; ratio: number; type: string };
	};
}
