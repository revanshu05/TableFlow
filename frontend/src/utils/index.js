const avatarColors = [
    "bg-red-700 text-red-100",
    "bg-orange-700 text-orange-100",
    "bg-amber-700 text-amber-100",
    "bg-yellow-700 text-yellow-100",
    "bg-lime-700 text-lime-100",
    "bg-green-700 text-green-100",
    "bg-emerald-700 text-emerald-100",
    "bg-teal-700 text-teal-100",
    "bg-cyan-700 text-cyan-100",
    "bg-sky-700 text-sky-100",
    "bg-blue-700 text-blue-100",
    "bg-indigo-700 text-indigo-100",
    "bg-violet-700 text-violet-100",
    "bg-purple-700 text-purple-100",
    "bg-pink-700 text-pink-100",
    "bg-rose-700 text-rose-100",
    "bg-olive-700 text-zinc-200",
];

export function getAvatarColor(name) {

    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return avatarColors[hash % avatarColors.length];

}

export function getAvatarName(name){
    if(!name) return;

    return name.split(" ").map(word => word[0]).join("").toUpperCase();
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}