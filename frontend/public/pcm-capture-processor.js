/**
 * PCM capture AudioWorklet processor.
 * Runs on the audio rendering thread — captures raw Float32 PCM samples
 * and posts them to the main thread for base64 encoding and streaming.
 *
 * Loaded via: audioContext.audioWorklet.addModule("/pcm-capture-processor.js")
 */
class PcmCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._buffer = new Float32Array(0);
        // ~256ms worth of samples at whatever sampleRate the context runs at
        this._bufferSize = Math.floor(sampleRate * 0.256);
    }

    process(inputs) {
        const input = inputs[0];
        if (!input || !input[0]) return true;

        const channel = input[0]; // mono — first channel

        // Accumulate into buffer
        const newBuffer = new Float32Array(this._buffer.length + channel.length);
        newBuffer.set(this._buffer);
        newBuffer.set(channel, this._buffer.length);
        this._buffer = newBuffer;

        // When we have enough samples, convert to Int16 and post
        while (this._buffer.length >= this._bufferSize) {
            const chunk = this._buffer.slice(0, this._bufferSize);
            this._buffer = this._buffer.slice(this._bufferSize);

            // Float32 → Int16
            const int16 = new Int16Array(chunk.length);
            for (let i = 0; i < chunk.length; i++) {
                const s = Math.max(-1, Math.min(1, chunk[i]));
                int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            this.port.postMessage({ pcm: int16 }, [int16.buffer]);
        }

        return true; // keep processor alive
    }
}

registerProcessor("pcm-capture-processor", PcmCaptureProcessor);
