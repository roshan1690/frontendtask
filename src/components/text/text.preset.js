import { typography } from "../../theme"

const BASE = {
    fontFamily: typography.primary,
    fontSize: 15,
}

const BOLD = {
    fontFamily: typography.secondary,
}

export const presets = {
    default: BASE,
    bold: BOLD,
    h1: {
        ...BOLD,
        fontSize: 26,
    },
    h2: {
        ...BOLD,
        fontSize: 22,
    },
    h3: {
        ...BASE,
        fontSize: 16,
    },
    h4: {
        ...BASE,
        fontSize: 13,
    },
    small: {
        ...BASE,
        fontSize: 11,
    },
}
