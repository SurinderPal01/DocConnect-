export const to12Hour = (time)=>{
    if(!time) return"";

    const [h,m] = time.split(":").map(Number);
    const period = h>12? "Pm" : "Am";
    const hour = h%12||12;
    return `${hour}:${String(m).padStart(2,"0")} ${period}`;
}