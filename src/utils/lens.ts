import {Lenses, Optional} from "@focuson/lens";

export type LensWithPath<Main, Child> = {
    path: string[]
    get: (m: Partial<Main>) => Child
    set: (m: Partial<Main>, c: Partial<Child>) => Partial<Main>
}

// Create an identity lens for a given object
export function identityLens<Main>(): LensWithPath<Main, Main> {
    return {
        path: [],
        get: (m: Partial<Main>) => m as Main,
        set: (m: Partial<Main>, c:Partial<Main> ) => c
    }
}

/**
 * Parses a string path and returns a lens focused on that property.
 */
export function parseLens<Main, Child>(s: string): LensWithPath<Main, Child> {
    const path = s.split('.');
    let builder = new LensBuilder<Main, any>(identityLens());
    for (const key of path) {
        builder = builder.focuson(key);
    }
    return builder.build();
}

// LensBuilder class for easier lens creation and focus chaining
export class LensBuilder<Main, Child> {
    lens: LensWithPath<Main, Child>;

    constructor(lens: LensWithPath<Main, Child>) {
        this.lens = lens;
    }

    build(): LensWithPath<Main, Child> {
        return this.lens
    }

    // Focus on a child property within the current lens focus
    focuson<K extends keyof Child>(key: K): LensBuilder<Main, Child[K]> {
        const thisLens = this.lens;
        return new LensBuilder<Main, Child[K]>({
            path: [...thisLens.path, key as string],
            get: (m: Partial<Main>) => {
                const parent = thisLens.get(m);
                let result = parent === undefined ? undefined : parent?.[key];
                return result as Child[K];
            },
            set: (m: Partial<Main>, c: Partial<Child[K]>) => {
                const current = thisLens.get(m) || {} as Child;
                const newChild = {...current, [key]: c};
                return thisLens.set(m, newChild);
            }
        });
    }

    focusonNth<Item>(this: LensBuilder<Main, Item[]>, index: number): LensBuilder<Main, Item> {
        const thisLens = this.lens;
        return new LensBuilder<Main, Item>({
            path: [...thisLens.path, `[${index}]`],
            get: (m: Partial<Main>) => {
                const childArray = thisLens.get(m);
                return Array.isArray(childArray) ? childArray[index] : undefined as Item;
            },
            set: (m: Partial<Main>, c: Partial<Item>) => {
                const childArray = thisLens.get(m) || [];
                const newChild = Array.isArray(childArray) ? [...childArray] : [];
                const existingItem = newChild[index] || {} as Item;
                newChild[index] = { ...existingItem, ...c };
                return thisLens.set(m, newChild);
            }
        });
    }
}

// Helper function to start building a lens
export function lensBuilder<T>() {
    return new LensBuilder(identityLens<T>());
}

export function lensFromPath<Main>(path: string): LensWithPath<Main, any> {
    const pathSegments = path.split(/\.|\[|\]/).filter(Boolean);
    let builder = pathSegments.reduce((lens, segment) => {
        if (segment.match(/^\d+$/)) {
            const index = parseInt(segment, 10);
            return lens.focusonNth(index);
        } else {
            return lens.focuson(segment);
        }
    }, lens<any>());
    return builder.lens;
}

export function lens<Main>(): LensBuilder<Main, Main> {
    return new LensBuilder<Main, Main>(identityLens())
}

// Compose two lenses into one
export function composeLens<Main, Intermediate, Child>(
    baseLens: LensWithPath<Main, Intermediate>,
    lens: LensWithPath<Intermediate, Child>
): LensWithPath<Main, Child> {
    return {
        path: [...baseLens.path, ...lens.path],
        get: (m: Partial<Main>) => {
            const intermediate = baseLens.get(m);
            return intermediate !== undefined ? lens.get(intermediate) : undefined as Child;
        },
        set: (m: Partial<Main>, c: Partial<Child>) => {
            const intermediate = baseLens.get(m) || {} as Intermediate;
            const newIntermediate = lens.set(intermediate, c);
            return baseLens.set(m, newIntermediate);
        }
    };
}
// Compose two lenses into one
// export function composeLens<Main, Child, GrandChild>(
//     outerLens: LensWithPath<Main, Child>,
//     innerLens: LensWithPath<Child, GrandChild>
// ): LensWithPath<Main, GrandChild> {
//     return {
//         get: (main: Main) => {
//             const child = outerLens.get(main);
//             return child ? innerLens.get(child) : undefined;
//         },
//         set: (main: Main, grandChildValue: GrandChild) => {
//             const child = outerLens.get(main) || ({} as Child);
//             const updatedChild = innerLens.set(child, grandChildValue);
//             return outerLens.set(main, updatedChild);
//         },
//         path: [...outerLens.path, ...innerLens.path],
//     };
// }
//
// export type PathToLensFn<S> = ( path: string ) => Optional<S, any>
//
// export function pathToLens<S> (): PathToLensFn<S> {
//     return path => {
//         const parts = path.split ( '.' ).map ( p => p.trim () ).filter ( p => p.length > 0 )
//         let lens: Optional<S, S> = Lenses.identity<S> ()
//         for ( let part of parts ) {
//             lens = lens.focusQuery ( part as any ) as any
//         }
//         return lens
//     }
// }
