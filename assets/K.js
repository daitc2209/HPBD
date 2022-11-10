const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist')
const playlistContainer = $('.playlist__container')
const cd = $('.cd')
const header1 = $('header h2')
const author = $('header p')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const PLAYER_STORAGE_KEY = 'ONE_PLAYER'
const showPlaylistIcon = $('.btn-list')
const closeBtn = $('.close-list')
const fav = $('.fav')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},  //chuyển từ json sang js
    songs: [
        {
            name: 'Thuyền Quyên',
            author: 'Diệu Kiên',
            image: './assets/img/thuyenquyen.jpg',
            path: './assets/music/thuyenquyen.mp3'
        },
        {
            name: 'Loser',
            author: 'Charlie Puth',
            image: './assets/img/loser.jpg',
            path: './assets/music/loser.mp3'
        },
        {
            name: 'Everyday',
            author: 'Ariana Grande',
            image: './assets/img/everyday.jpg',
            path: './assets/music/everyday.mp3'
        },
        {
            name: 'Happy Birthday 2 thằng chó !!!!!',
            author: 'Phan Đình Tùng',
            image: './imgs/TCD.jpg',
            path: './assets/music/hb.mp3'
        },
        {
            name: 'Em sẽ hối hận',
            author: 'Vũ Duy Khánh',
            image: './assets/img/eshh.jpg',
            path: './assets/music/eshh.mp3'
        },
        {
            name: 'Blinding Lights',
            author: 'Nguyễn Đức Khải',
            image: '../imgs/Kngu6.jpg',
            path: './assets/music/blinding-lights.mp3'
        },
        
        {
            name: 'Cíu vãn kịp không',
            author: 'Vương Anh Tú',
            image: '../imgs/mb2.jpg',
            path: './assets/music/cvkk.mp3'
        },
        {
            name: 'Toxic',
            author: 'BoyWithUke',
            image: '../imgs/Kngu5.jpg',
            path: './assets/music/toxic.mp3'
        },
        {
            name: 'Unstoppable',
            author: 'Sia',
            image: '../imgs/mb1.jpg',
            path: './assets/music/unstoppable.mp3'
        },
        // {
        //     name: 'Blinding Lights',
        //     author: 'Nguyễn Đức Khải',
        //     image: '../imgs/Kngu6.jpg',
        //     path: './assets/music/blinding-lights.mp3'
        // },
    ],

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config)) //chuyển từ js sang json
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style ="background-image: url('${song.image}')">
                </div>
                <div class="song-body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                
                <span class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </span>
            </li>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    //Xử lý lấy bài hát hiện tại, currentSong là 1 Object
    //nghĩa là thêm 1 Object currentSong vào trong Object app
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    togglePlaylist(){
        playlistContainer.classList.toggle('list-open')
    },

    toggleFavour(){
        fav.classList.toggle('active')
    },

    handleEvents: function () {
        const _this = this      //gán object app vào _this 
        const cdWidth = cd.offsetWidth              // thay đổi padding và chiều rộng

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'     //quay 360 độ
            }
        ], {
            duration: 10000,            //10 seconds
            iterations: Infinity        // lặp lại vô hạn
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to / thu nhỏ
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWith = cdWidth - scrollTop

            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0
            cd.style.opacity = newCdWith / cdWidth      // làm mờ dần: lấy chiều rộng cũ chia cho cái mới
        }

        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                // _this.isPlaying = false
                // audio.pause()
                // player.classList.remove('playing')
                audio.pause()
            } else {
                // _this.isPlaying = true
                // audio.play()
                // player.classList.add('playing')
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()

        }

        // Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration)                 //duration: là thời lượng của bài hát
            {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua 
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value //lấy tổng thời lượng / 100 * số giây đc tua
            audio.currentTime = seekTime
        }

        //Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        //Xử lý lặp lại 1 song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option'))
            // target: trả về chính mục tiêu mà mình vừa click
            {   //closest: trả về element 1 là chính nó, 2 là trả về thẻ cha của nó, ko tìm thấy nó sẽ trả về null
                
                //Xử lý khi click vào song
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index) //gán cái index của cái songNode vào currentIndex
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //Xử lý khi click vào song option
                if (e.target.closest('.option')){

                }
            }
        }

        showPlaylistIcon.onclick = function() {
            _this.togglePlaylist()
        }

        closeBtn.onclick = function() {
            _this.togglePlaylist()
        }

        fav.onclick = function() {
            _this.toggleFavour()
        }

    },


    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    //Lấy bài hát hiện tại
    loadCurrentSong: function () {

        header1.textContent = this.currentSong.name
        author.textContent = this.currentSong.author
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)    //lặp cho đến khi nó bằng cái cũ
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',             //thanh cuộn mượt, default là auto
                block: 'center'                 //khi chuyển từ cuối bài về đầu bài nó sẽ kéo đc về đầu bài
            })
        }, 2000)
    },

    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat và random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start()
