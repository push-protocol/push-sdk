const randseed: number[] = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

function seedrand(seed: string) {
    randseed.fill(0);

    for (let i = 0; i < seed.length; i++) {
        randseed[i % 4] = ((randseed[i % 4] << 5) - randseed[i % 4]) + seed.charCodeAt(i);
    }
}

function rand(): number {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = randseed[0] ^ (randseed[0] << 11);

    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
}

function createColor(): string {
    // saturation is the whole color spectrum
    const h = Math.floor(rand() * 360);
    // saturation goes from 40 to 100, it avoids grayish colors
    const s = `${Math.floor(rand() * 60) + 40}%`;
    // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    const l = `${Math.floor((rand() + rand() + rand() + rand()) * 25)}%`;

    return `hsl(${h},${s},${l})`;
}

function createImageData(size: number): number[] {
    const width = size; // Only support square icons for now
    const height = size;

    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;

    const data: number[] = [];
    for (let y = 0; y < height; y++) {
        let row: number[] = [];
        for (let x = 0; x < dataWidth; x++) {
            // this makes foreground and background color have a 43% (1/2.3) probability
            // spot color has a 13% chance
            row[x] = Math.floor(rand() * 2.3);
        }
        const r = row.slice(0, mirrorWidth);
        r.reverse();
        row = row.concat(r);

        for (let i = 0; i < row.length; i++) {
            data.push(row[i]);
        }
    }

    return data;
}

interface Options {
    seed?: string;
    size?: number;
    scale?: number;
    color?: string;
    bgcolor?: string;
    spotcolor?: string;
}

function buildOpts(opts: Options): Options {
    const newOpts: Options = {};

    newOpts.seed = opts.seed || Math.floor((Math.random() * Math.pow(10, 16))).toString(16);

    seedrand(newOpts.seed);

    newOpts.size = opts.size || 8;
    newOpts.scale = opts.scale || 4;
    newOpts.color = opts.color || createColor();
    newOpts.bgcolor = opts.bgcolor || createColor();
    newOpts.spotcolor = opts.spotcolor || createColor();

    return newOpts;
}

export function renderIcon(opts: Options, canvas: HTMLCanvasElement): HTMLCanvasElement {
    opts = buildOpts(opts || {});
    const imageData = createImageData(opts.size!);
    const width = Math.sqrt(imageData.length);

    canvas.width = canvas.height = opts.size! * opts.scale!;

    const cc = canvas.getContext('2d')!;
    cc.fillStyle = opts.bgcolor!;
    cc.fillRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = opts.color!;

    for (let i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
            const row = Math.floor(i / width);
            const col = i % width;

            // if data is 2, choose spot color, if 1 choose foreground
            cc.fillStyle = imageData[i] === 1 ? opts.color! : opts.spotcolor!;
            cc.fillRect(col * opts.scale!, row * opts.scale!, opts.scale!, opts.scale!);
        }
    }

    return canvas;
}

export function createIcon(opts: Options): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    renderIcon(opts, canvas);

    return canvas;
}

export function createBlockie(account: string): HTMLCanvasElement {
    const iconParams = {
        seed: account,
        size: 10,
        scale: 3,
    };

    return createIcon(iconParams);
}
