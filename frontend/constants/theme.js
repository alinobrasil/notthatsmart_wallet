export const COLORS = {
    blue: "#1F2269",
    red: "#EE4141",
    rose: "#ebbdbd",
    lightrose: "#fef8f8",
    white: "#FFF",
    gray: "#74858C",
};

export const SIZES = {
    base: 12,
    small: 14,
    font: 18,
    medium: 26,
    large: 32,
    extraLarge: 44,
};

export const FONTS = {
    bold: "InterBold",
    semiBold: "InterSemiBold",
    medium: "InterMedium",
    regular: "InterRegular",
    light: "InterLight",
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    medium: {
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    dark: {
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14,
    },
};
