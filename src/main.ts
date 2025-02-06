// SPDX-License-Identifier: MPL-2.0

import generateHTML from './generate/html.js';
import Speakers from './speakers.js';
const filepicker = document.getElementById("filepicker") as HTMLInputElement
const renderarea = document.getElementById("renderarea") as HTMLDivElement
const speakerstable = document.getElementById("speakerstable") as HTMLTableSectionElement

const speakers: Speakers = new Speakers()
speakers.onchange = () => {
    speakers.render(speakerstable)
    renderarea.innerHTML = generateHTML(speakers.conversation)
}

filepicker.addEventListener("change", (ev) => {
    if (filepicker.files == null) return
    for (const file of filepicker.files) {
        speakers.add(file)
    }
})