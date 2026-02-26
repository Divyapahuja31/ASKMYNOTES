class PcmPlaybackProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._buffer = new Float32Array(0);
        this._primed = false;
        this._prebufferSamples = Math.floor(sampleRate * 0.12); // ~120ms
        this.port.onmessage = (event) => {
            const msg = event.data;
            if (msg?.type === "clear") {
                this._buffer = new Float32Array(0);
                this._primed = false;
                return;
            }
            if (msg?.type === "data" && msg.pcm) {
                const int16 = msg.pcm;
                const floatChunk = new Float32Array(int16.length);
                for (let i = 0; i < int16.length; i++) {
                    floatChunk[i] = int16[i] / 32768;
                }
                const merged = new Float32Array(this._buffer.length + floatChunk.length);
                merged.set(this._buffer, 0);
                merged.set(floatChunk, this._buffer.length);
                this._buffer = merged;
            }
        };
    }

    process(_inputs, outputs) {
        const output = outputs[0];
        if (!output || output.length === 0) return true;

        const channel = output[0];
        const available = this._buffer.length;

        if (!this._primed) {
            if (available >= this._prebufferSamples) {
                this._primed = true;
            } else {
                channel.fill(0);
                return true;
            }
        }

        if (available >= channel.length) {
            channel.set(this._buffer.subarray(0, channel.length));
            this._buffer = this._buffer.subarray(channel.length);
        } else if (available > 0) {
            channel.set(this._buffer);
            channel.fill(0, available);
            this._buffer = new Float32Array(0);
            this._primed = false;
        } else {
            channel.fill(0);
            this._primed = false;
        }

        return true;
    }
}

registerProcessor("pcm-playback-processor", PcmPlaybackProcessor);
