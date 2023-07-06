const memeVistoMes = localStorage.getItem('memeVistoMes');
const mesActual = (new Date()).getMonth();
const memeVisto = (memeVistoMes == mesActual);

if (!memeVisto) {
    openModalMeme();
    localStorage.setItem('memeVistoMes', mesActual);
}