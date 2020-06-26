new Vue({
    el:'#app',
    data:{
        showModal: true,
        deltaTime: 0, // 5
        processing: false,
        position: 144,
        steps: [],
        flies: [],
        randomPlaces: [],
        code: '',
        commands: [],
        rotation: 0,
        shiftX: 0,
        shiftY: 0,
        direction: 'top',
        stepsCount: 0,
        fliesCount: 1,
        state: 'ОК: Всё отлично!',
        stateBackground: 'greenyellow',
        level: 1,
        browser: '',
    },
    methods: {
        left_btn(){
            this.code += 'turn left\n'
        },
        go_btn(){
            if (isFinite(Number(this.code[this.code.length-2]))){
                this.code = this.code.substring(0, this.code.length-2) + `${Number(this.code[this.code.length-2])+1}\n`
            }
            else{
                this.code += 'go 1\n'
            }
        },
        right_btn(){
            this.code += 'turn right\n'
        },
        randomInteger() {
            let min = 1
            let max = 144
              return Math.floor(Math.random() * (max - min)) + min;
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async go(value){
            if (this.processing == false) {return}

            if (this.direction == 'top') {
                for (let j = 0; j < value; j++) {
                    if ([1,2,3,4,5,6,7,8,9,10,11,12].indexOf(this.position)!=-1){
                        this.finish()
                        this.error("Лягушка не может выпрыгнуть за край болота!")
                        return
                    }
                    for (let i = 0; i > -65; i--) {
                        this.shiftX--
                        await this.sleep(this.deltaTime)
                    }
                    this.shiftX = 0
                    this.steps.push(this.position)
                    this.stepsCount++
                    if (this.steps.indexOf(this.position-12)!=-1){
                        this.steps.splice(this.steps.indexOf(this.position-12),1)
                    }
                    if (this.flies.indexOf(this.position-12)!=-1){
                        this.flies.splice(this.flies.indexOf(this.position-12),1)
                    }
                    this.position -= 12
                }
            }
            else if (this.direction == 'bottom') {
                for (let j = 0; j < value; j++) {
                    if ([133,134,135,136,137,138,139,140,141,142,143,144].indexOf(this.position)!=-1){
                        this.finish()
                        this.error("Лягушка не может выпрыгнуть за край болота!")
                        return
                    }
                    for (let i = 0; i < 65; i++) {
                        this.shiftX++
                        await this.sleep(this.deltaTime)
                    }
                    this.shiftX = 0
                    this.steps.push(this.position)
                    this.stepsCount++
                    if (this.steps.indexOf(this.position+12)!=-1){
                        this.steps.splice(this.steps.indexOf(this.position+12),1)
                    }
                    if (this.flies.indexOf(this.position+12)!=-1){
                        this.flies.splice(this.flies.indexOf(this.position+12),1)
                    }
                    this.position += 12
                }
            }
            else if (this.direction == 'left') {
                for (let j = 0; j < value; j++) {
                    if ([1,13,25,37,49,61,73,85,97,109,121,133].indexOf(this.position)!=-1){
                        this.finish()
                        this.error("Лягушка не может выпрыгнуть за край болота!")
                        return
                    }
                    for (let i = 0; i > -(window.innerWidth/18); i--) {
                        this.shiftY--
                        await this.sleep(this.deltaTime)
                    }
                    this.shiftY = 0
                    this.steps.push(this.position)
                    this.stepsCount++
                    if (this.steps.indexOf(this.position-1)!=-1){
                        this.steps.splice(this.steps.indexOf(this.position-1),1)
                    }
                    if (this.flies.indexOf(this.position-1)!=-1){
                        this.flies.splice(this.flies.indexOf(this.position-1),1)
                    }
                    this.position -= 1
                }
            }
            else if (this.direction == 'right') {
                for (let j = 0; j < value; j++) {
                    if ([12,24,36,48,60,72,84,96,18,120,132,144].indexOf(this.position)!=-1){
                        this.finish()
                        this.error("Лягушка не может выпрыгнуть за край болота!")
                        return
                    }
                    for (let i = 0; i < (window.innerWidth/18); i++) {
                        this.shiftY++
                        await this.sleep(this.deltaTime)
                    }
                    this.shiftY = 0
                    this.steps.push(this.position)
                    this.stepsCount++
                    if (this.steps.indexOf(this.position+1)!=-1){
                        this.steps.splice(this.steps.indexOf(this.position+1),1)
                    }
                    if (this.flies.indexOf(this.position+1)!=-1){
                        this.flies.splice(this.flies.indexOf(this.position+1),1)
                    }
                    this.position += 1
                }
            }
        },

        async turn(direct){
            if (this.processing == false) {return}

            if (this.direction == 'top') {
                this.direction = direct
            }
            else if ((this.direction == 'left' && direct == 'left') || (this.direction == 'right' && direct == 'right')) {
                this.direction = 'bottom'
            }
            else if ((this.direction == 'left' && direct == 'right') || (this.direction == 'right' && direct == 'left')) {
                this.direction = 'top'
            }
            else if (this.direction == 'bottom' && direct == 'left') {
                this.direction = 'right'
            }
            else if (this.direction == 'bottom' && direct == 'right') {
                this.direction = 'left'
            }

            if (direct == 'left') {
                for (let i = 0; i < 90; i++) {
                    this.rotation--
                    await this.sleep(this.deltaTime)
                }
            }
            if (direct == 'right') {
                for (let i = 0; i < 90; i++) {
                    this.rotation++
                    await this.sleep(this.deltaTime)
                }
            }
        },

        error(description){
            this.state = `ERROR: ${description}`
            this.stateBackground = 'red'
        },

        async finish(){
            this.processing = false
            if (this.flies.length == 0) {

                this.stepsCount = 0
                this.steps = []
                this.position = 144
                this.rotation = 0
                this.direction = 'top'
                this.stateBackground = 'yellow'
                this.state = 'УРОВЕНЬ ПРОЙДЕН!!!'
                this.code = ''

                this.level++
                if (this.level%3==0) { this.fliesCount++ }
                
                this.generateRandomPlaces()
                
                this.flies.splice(0,this.flies.length)
                for(let i = 0; i < this.randomPlaces.length; i++) {
                    this.flies.push(this.randomPlaces[i])
                }
            }
        },

        async run(){
            this.showModal = false
            if (this.processing == true) {return}
            this.processing = true
            this.commands = this.code.split("\n")

            this.flies.splice(0,this.flies.length)
            for(let i = 0; i < this.randomPlaces.length; i++) {
                this.flies.push(this.randomPlaces[i])
            }
            this.stepsCount = 0
            this.steps = []
            this.state = 'ОК: Всё отлично!'
            this.position = 144
            this.rotation = 0
            this.direction = 'top'
            this.stateBackground = 'greenyellow'
            for (var i = 0; i < this.commands.length; i++) {
                let command = this.commands[i].replace(/\s+/g, ' ').trim().split(' ')

                if (this.commands[i] == '' || this.commands[i] == ' ') {
                    continue
                }

                if (command[0] != 'go' && command[0] != 'turn') {
                    this.error("Не существует такой функции как "+command[0]+'!')
                    this.finish()
                    return
                }
                else if (command.length != 2) {
                    this.error("Функция "+command[0]+" принимает на вход один параметр!")
                    this.finish()
                    return
                }
                await this.sleep(100)

                if (command[0] == 'go') {
                    let num = command[1]
                    if (isFinite(+num) && Number(num) > 0) {
                        await this.go(Number(num))
                    }else{
                        this.error("Функция 'go' принимает на вход натуральное число!")
                        return
                    }
                }
                else if (command[0] == 'turn') {
                    let direct = command[1]
                    if (direct == 'left') { await this.turn('left') }
                    else if (direct == 'right') {await this.turn('right') }
                    else {
                        this.error("Функция 'turn' принимает на вход только 'left' или 'right'!")
                        this.finish()
                        return
                    }
                }
            }
            this.finish()
        },
        generateRandomPlaces(){
            this.randomPlaces = []
            let randomPlace = this.randomInteger()
            
            for (let i = 0; i < this.fliesCount; i++) {
                while (this.randomPlaces.indexOf(randomPlace)!=-1){
                    randomPlace = this.randomInteger()
                }
                
                this.randomPlaces.push(randomPlace)
            }
            
        }
    },

    computed: {
        style () {
            let rot = this.rotation - 15
            return { 
                transform: 'rotate(' + rot + 'deg)',
                position: 'relative',
                top: this.shiftX + 'px',
                left: this.shiftY + 'px'
            }
        }
    },
    mounted() {
        this.generateRandomPlaces()
        for(let i = 0; i < this.randomPlaces.length; i++) {
            this.flies.push(this.randomPlaces[i])
        }
        if (navigator.userAgent.search(/Safari/) > 0) {this.browser = 'Safari'};
        if (navigator.userAgent.search(/Firefox/) > 0) {this.browser = 'MozillaFirefox'};
        if (navigator.userAgent.search(/MSIE/) > 0 || navigator.userAgent.search(/NET CLR /) > 0) {this.browser = 'Internet Explorer'};
        if (navigator.userAgent.search(/Chrome/) > 0) {this.browser = 'Google Chrome'};
        if (navigator.userAgent.search(/YaBrowser/) > 0) {this.browser = 'Яндекс браузер'};
        if (navigator.userAgent.search(/OPR/) > 0) {this.browser = 'Opera'};
        if (navigator.userAgent.search(/Konqueror/) > 0) {this.browser = 'Konqueror'};
        if (navigator.userAgent.search(/Iceweasel/) > 0) {this.browser = 'Debian Iceweasel'};
        if (navigator.userAgent.search(/SeaMonkey/) > 0) {this.browser = 'SeaMonkey'};
        if (navigator.userAgent.search(/Edge/) > 0) {this.browser = 'Microsoft Edge'};
    },
})
