// SPDX-License-Identifier: MPL-2.0

export interface Segment {
    start: number,
    end: number,
    text: string
}
export interface Speaker {
    name: string
    color: string
    segments: Segment[]
}

export type Conversation = {
    speaker: Speaker,
    segment: Segment
}[]

export default class Speakers {
    speakers: Speaker[] = []
    onchange: () => void = () => { }

    add(file: File) {
        const fileName = file.name.endsWith(".json") ? file.name.slice(0, -5) : file.name
        const reader = new FileReader()

        reader.onload = ev => {
            try {
                parseJSON(fileName, ev.target!.result!.toString()).forEach(v => this.speakers.push(v));
            } catch (error) {
                console.error(error)
                alert("failed to parse file!")
                return
            }
            finally { this.onchange() }
        }
        reader.readAsText(file)
    }

    get conversation(): Conversation {
        const segments = []
        for (const speaker of this.speakers) {
            for (const segment of speaker.segments) {
                segments.push({ segment, speaker })
            }
        }
        segments.sort((a, b) => a.segment.start - b.segment.start)
        return segments
    }

    render(table: HTMLTableSectionElement) {
        table.innerHTML = ""

        for (const speaker of this.speakers) {
            let row = table.insertRow();

            let nameInput = document.createElement("textarea")
            nameInput.rows = 1;
            nameInput.value = speaker.name
            nameInput.onchange = () => { speaker.name = nameInput.value; this.onchange() }
            let name = row.insertCell()
            name.appendChild(nameInput)

            let colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.value = speaker.color;
            colorInput.onchange = () => { speaker.color = colorInput.value; this.onchange() }
            let colour = row.insertCell()
            colour.appendChild(colorInput)

            let removeInput = document.createElement("button")
            removeInput.innerText = "X"
            removeInput.style.color = "red"
            removeInput.onclick = () => {
                row.remove()
                const idx = this.speakers.indexOf(speaker)
                if (idx > -1) {
                    this.speakers.splice(idx, 1)
                }
                this.onchange()
            }
            let remove = row.insertCell()
            remove.appendChild(removeInput)
        }

    }
}

function parseJSON(fileName: string, json: string): Speaker[] {
    var data = JSON.parse(json)

    if (Array.isArray(data)) {
        const speakers = []
        for (const speaker of data) {
            speakers.push({ name: speaker["name"], segments: speaker["segments"], color: speaker["color"] ?? "white" })
        }
        return speakers
    } else {
        return [{ name: fileName, segments: data["segments"], color: "white" }]
    }
    throw new Error()
}