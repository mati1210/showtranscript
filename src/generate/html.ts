// SPDX-License-Identifier: MPL-2.0

import { Conversation } from "../speakers"

export default function generateHTML(conversation: Conversation): string {
    const div = document.createElement("div")
    for (const segment of conversation) {
        const p = document.createElement("p")
        p.style.color = segment.speaker.color
        p.innerText = `${timestamp(segment.segment.start)} ${segment.speaker.name}: ${segment.segment.text}`
        div.appendChild(p)
    }
    return div.innerHTML
}

function divmod(a: number, b: number): [number, number] { return [Math.floor(a / b), a % b] }
function timestamp(secs: number) {
    var csecs = secs.toFixed(2)
    csecs = csecs.substring(csecs.length - 2)

    var [mins, secs] = divmod(secs, 60)
    var [hrs, mins] = divmod(mins, 60)

    const f = (n: number) => n.toFixed(0).padStart(2, '0')
    return `[${f(hrs)}:${f(mins)}:${f(secs)}.${csecs}]`
}