
export const linkSymbolImage = {
    "C": "./assets/Cards/Clubs.png",
    "S": "./assets/Cards/Spades.png",
    "H": "./assets/Cards/Hearts.png",
    "D": "./assets/Cards/Diamonds.png",
}

export const linkBackImage = {
    Card: "./assets/Cards/Card_Back.png",
    Deck: "./assets/Cards/Card_Deck_Back.png",
}

export async function loadAllImage<T extends string>(objectImageLink: Record<T, string>): Promise<Record<T, HTMLImageElement>> {
    type TupleGenericImage = [T, HTMLImageElement];

    let promiseArray: Promise<TupleGenericImage>[] = [];

    // Necessary to assert with [T, string][], because key is always a string when initiated.
    // NOTE: We could do Object.keys() then objectImageLink[key] but I feel like it would be less efficient.
    for (const [key, value] of (Object.entries(objectImageLink) as [T, string][])) {
        const loadedImage = loadImage(key, value);
        promiseArray.push(loadedImage);
    }

    const resolvedArray = await Promise.all(promiseArray);
    let returnedObject = {} as Record<T, HTMLImageElement>;

    for (let i = 0;i < resolvedArray.length;i++) {
        const [key, value] = resolvedArray[i];
        Object.assign(returnedObject, { [key]: value });
    }

    return returnedObject;
    

    function loadImage(key: T, src: string): Promise<TupleGenericImage> {

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve([key, img]);
            img.onerror = () => reject(new Error(`Couldn't load the image: ${src}`))
            img.src = src
        })
    }
}
