//放大缩小系统各类字体大小
export function zoomSystemFontSize(scale) {
    const styles = getComputedStyle(document.querySelector(":root"));
    let xs = transPxtoNumber(String(styles.getPropertyValue("--font-size-xs")).trim());
    let sm = transPxtoNumber(String(styles.getPropertyValue("--font-size-xs")).trim());
    let md = transPxtoNumber(String(styles.getPropertyValue("--font-size-xs")).trim());
    let lg = transPxtoNumber(String(styles.getPropertyValue("--font-size-xs")).trim());
    let xl = transPxtoNumber(String(styles.getPropertyValue("--font-size-xs")).trim());
    document.documentElement.style.setProperty("--font-size-xs", xs * scale + "px");
    document.documentElement.style.setProperty("--font-size-sm", sm * scale + "px");
    document.documentElement.style.setProperty("--font-size-md", md * scale + "px");
    document.documentElement.style.setProperty("--font-size-lg", lg * scale + "px");
    document.documentElement.style.setProperty("--font-size-xl", xl * scale + "px");
}

export function transPxtoNumber(value) {
    return Number(value.substring(0, value.indexOf('px')))
}