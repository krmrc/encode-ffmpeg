let video_bitrate = 1000;
// 動画の再生時間上限
window.onload = function () {
    // ファイル選択時のイベントを設定
    document.getElementById("uploader").onchange = function (e) {
        var file = e.target.files[0];
        // 選択されたファイルをチェック用のメソッドに渡す
        checkVideoDuration(file);
    }
}

// 再生時間チェック用メソッド
let checkVideoDuration = function (file) {
    let video = document.createElement('video');
    let fileURL = URL.createObjectURL(file);
    video.src = fileURL;
    video.ondurationchange = function () {
        console.log(this.duration);
        video_bitrate = parseInt(8 * 8172 / this.duration) - 64;
        console.log(video_bitrate);
        URL.revokeObjectURL(this.src);
    };
}
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
const transcode = async ({ target: { files } }) => {
    const { name } = files[0];
    await ffmpeg.load();
    ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
    await ffmpeg.run('-i', name, '-b:v', video_bitrate + 'k', '-b:a', '64k', 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const o_video = document.getElementById('player');
    o_video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById('uploader').addEventListener('change', transcode);
}, false);
