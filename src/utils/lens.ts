export type LensAndPath<Main, Child> = {
    get: (main: Main) => Child | undefined;
    set: (main: Main, child: Child) => Main;
    path: string[];
};

// Create an identity lens for a given object
export function identityLens<T>(): LensAndPath<T, T> {
    return {
        get: (main: T) => main, // Simply return the main object
        set: (main: T, child: T) => child, // Replace the main object with the child
        path: []
    };
}

// Create a lens that focuses on a specific child property in a larger object
export function child<Main, T, K extends keyof T>(lens: LensAndPath<Main, T>, key: K): LensAndPath<Main, T[K]> {
    return {
        get: (main: Main) => {
            const parent = lens.get(main);
            return parent ? parent[key] : undefined;
        },
        set: (main: Main, childValue: T[K]) => {
            const parent = lens.get(main) || {} as T;
            const updatedParent = {
                ...parent,
                [key]: childValue
            };
            return lens.set(main, updatedParent);
        },
        path: [...lens.path, key as string]
    };
}

/**
 * we parse the left side of the values of the array, and it returns a lens that specifically point to that property
 */
export function parseLens<Main, Child>(s: string): LensAndPath<Main, Child> {
    const path = s.split('.');
    let builder = new LensBuilder<Main, any>(identityLens());
    for (const key of path) {
        builder = builder.focusOn(key);
    }
    return builder.build();
}

// LensBuilder class for easier lens creation and focus chaining
export class LensBuilder<Main, Child> {
    private _lens: LensAndPath<Main, Child>;

    constructor(lens: LensAndPath<Main, Child>) {
        this._lens = lens;
    }

    // Focus on a child property within the current lens focus
    focusOn<K extends keyof Child>(key: K): LensBuilder<Main, Child[K]> {
        return new LensBuilder(child(this._lens, key));
    }

    // Return the built lens
    build() {
        return this._lens;
    }
}

// Helper function to start building a lens
export function lensBuilder<T>() {
    return new LensBuilder(identityLens<T>());
}
