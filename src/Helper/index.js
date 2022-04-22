export const getMacAppDir = () => {
    let runningDir = __dirname;
    let index = runningDir.indexOf("awesome_todolist") + 16;
    let realDir = runningDir.slice(0, index);
    return realDir;
}