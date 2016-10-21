module.exports = class {
  constructor(options){
    let
      preferences = {}
    ;
    this.settings = $.extend(preferences, options);

    this.field = $('.bubbles-controllers__field');

    let getData = () => {
      this.data = this.field.text().replace(/\r|\n| /g, '').split(',');
      for(let i=0; i<this.data.length;i++) this.data[i] = +this.data[i];
      return this.data;
    };

    /*start sort*/
    $('.bubbles-controllers__button_start').on('click', (e) => {
      if(this.state === 'pause'){
        this.state = 'play';
        this._check();
      }
      else {
        this._create(this.settings.elementSelector, getData())
        this.start();
      }
    });

    /*start pause*/
    $('.bubbles-controllers__button_pause').on('click', (e) => {
      this.state = 'pause';
    });

    /*start stop*/
    $('.bubbles-controllers__button_stop').on('click', (e) => {
      if(this.svg){
        this._clear();
      }
    });

    /*generate random*/
    $('.bubbles-controllers__generate').on('click', (e) => {
      this.field.html(this.generateRandom().join(', '));
    });
  }
  /*/constructor/*/


  _clear(){
    this.svg
    /*clear*/
    .remove();
  }


  /*/_clear/*/
  _create(elementSelector, data){
    if(this.svg){
      this._clear();
    }

    this.svg =
      d3.select(elementSelector)
      /**/
      .append('svg')
      .attr({
        'width': '100%',
        'height': '100%'
      });


    this.container =
      this.svg.selectAll('svg')
      .data(data)
      .enter()
      .append('g')
      .attr({
        'class': 'bubbles-queue__item',

        'transform': (d, i) => {
          return  `translate(${((40 + d) * 2) +  i}, 100)`
        }
      });

    this.circle =
      this.container
      .append('circle')
      .attr({
        'cy': 100/*100*/,
        'r': (d, i) => {
          return this.settings.minDiameter + (d < 0 ? 0 : (d/3));
        }
      });


    this.text =
      this.container
      .append('text')
      .attr({
        'class': 'bubbles-queue__text',
        'dx': (d, i) => {
          // return d >= 10 ? -20 : -8;
          let
            distance = this.settings.minDiameter + d,
            dLength = d.toString().split('')
          ;

          if(dLength.length == 1){
            return (distance / 2) + 4;
          }

          if(dLength.length == 2){
            return (distance / 2) - 4;
          }
        },
        'dy':100
      })
      .text((d) => {
        return d;
      });



    this.index = (() => {
      let r = [];
      for (let i = 0; i < this.data.length; i++){
        r[i] = i;
      }
      return r;
    })();

    this.event = [];
    this.generateRandom();
  }
  /*/constructor/*/
  _check(){
    if(this.state === 'pause'){
      return;
    }
    this.event.shift();
    if(this.event.length){
      if(this.event[0].event == 'compare'){
        this._compare(this.event[0].id1,this.event[0].id2)
      }
      else{
        this._change(this.event[0].id1,this.event[0].id2)
      }
    }
  }

  _compare(id1, id2){
    let
      count = 0
    ;
    this.circle
    .attr({
      'class': (d, i) => {
        return (i == this.index[id1] || i == this.index[id2]) ? 'bubbles-queue__bubble_active': 'bubbles-queue__bubble';
      }
    })
    .transition()
    .duration(this.settings.duration)
    .each('end', () => {
      if(!count){
        count+=1;
        this._check();
      }
    })

  }
  /*/compare/*/


  _change(id1, id2){
    let
      count = 0
    ;

    this.index[id1] = this.index[id1] ^ this.index[id2];

    this.index[id2] = this.index[id1] ^ this.index[id2];

    this.index[id1] = this.index[id1] ^ this.index[id2];

    this.container
      .transition()
      .duration(this.settings.duration)
      .ease(/*'linear', 'quad', 'cubic', 'sin', 'exp', */'circle'/*, 'elastic', 'back', 'bounce'*/)
      .attr({
        'transform': (d, i) => {

          return  `translate(${200 + 65 * this.index.indexOf(i)}, 0)`;
        }
      })
        .each('end', () => {
          if(!count){
            count+=1;
            this._check();
          }
        })

  }
  /*/change/*/

  start(){
    let
      data = this.data.slice(0)
    ;

    for (let i = data.length - 1, flag; i > 0; i--) {
      flag = true;
      for (var j = 0; j < i; j++) {
        /**/
        this.event.push({
          event:'compare',
          id1:j,
          id2:j+1
        });
        /**/
        if (data[j] > data[j + 1]) {
          flag = false;
          let
            temp = data[j]
          ;
          data[j] = data[j + 1];
          data[j + 1] = temp;

          this.event.push({
            event:'change',
            id1:j,
            id2:j+1
          });
        }
      }

      if (flag) {
        break;
      }

    }
    if(this.event.length){
      this._compare(
        this.event[0].id1,
        this.event[0].id2
      );
    }
  }
  /*/start/*/
  generateRandom(){
    let
      sampleArr = [],
      randomArr = []
    ;
    for(let i = this.settings.data.start; i < (this.settings.data.end + 1); i++){
      sampleArr.push(i);
    }

    for(let i = 1; i < (this.settings.data.length + 1); i++){
      if(sampleArr.length){
        let
          randomNumber = Math.floor/*~~*/(Math.random() * sampleArr.length),
          sampleArrRandomNumber = sampleArr[randomNumber]
        ;
          randomArr.push(sampleArrRandomNumber);
          sampleArr.splice(sampleArr.indexOf(sampleArrRandomNumber), 1);
      }
      else{
        break;
      }
    }

    return randomArr;
  }

};
