//github.com/acdtrx/ltw


let editarebutondreapta=function(){
let div=  document.getElementById("log");
  let children = div.childNodes;
  for (let i = 0; i < children.length; i++) {
    let copil = children[i];
    div.removeChild(copil);
  }

  if(localStorage.getItem("logedin")==="true"){
    let link_admin=document.createElement("a");
    link_admin.href="admin_index.html";
    let text_admin=document.createTextNode("Admin View");
    link_admin.appendChild(text_admin);
    div.appendChild(link_admin);

    let logout=document.createElement("a");
    logout.href="index.html";
    let text_logout=document.createTextNode("Logout");
    logout.appendChild(text_logout);
    logout.onclick=negare;
    div.appendChild(logout);


  } else{

      let div_login=document.createElement("div");

      let username=document.createElement("label");
      let text_user=document.createTextNode("Username : ");
      username.appendChild(text_user);
      let spatiu_username=document.createElement("input");
      spatiu_username.id="USERNAME";
      username.appendChild(spatiu_username);
      div_login.appendChild(username);

      let parola=document.createElement("label");
      let text_parola=document.createTextNode("Parola : ");
      parola.appendChild(text_parola);
      let spatiu_parola=document.createElement("input");
      spatiu_parola.id="PASSWORD";
      spatiu_parola.type="password";
      parola.appendChild(spatiu_parola);
      div_login.appendChild(parola);

      let buton=document.createElement("a");
      buton.href="#";
      buton.onclick=aprobare;

      buton.appendChild(document.createTextNode("Login"));
      div_login.appendChild(buton);

      div.appendChild(div_login);

  }

};

let aprobare=function(){
let username=document.getElementById("USERNAME").value;
let parola=document.getElementById("PASSWORD").value;
if(username!=="Andrei"){
  alert("Ai gresit username-ul");
}
else if (parola!=="Andrei"){
  alert("Ai gresit parola");


}
else{
  localStorage.setItem("logedin","true");
  editarebutondreapta();

}

};

let negare=function(){
  localStorage.setItem("logedin","false");
  editarebutondreapta();

};


let get_avarage_RGB =(a)=>{
  var canvas = document.createElement('canvas');
 var RGB={r:0,g:0,b:0};
var data,width,height;
let i=-4;
let length;
let count=0;
height=canvas.height=a.height;
width=canvas.width=a.width;

  canvas.getContext('2d').drawImage(a,0,0,width,height);

  data=canvas.getContext('2d').getImageData(0,0,width,height).data;

length=data.length;
while( (i+=4)<length ){
  if(data[i+4]!==0){
    ++count;
    RGB.r+=data[i];
    RGB.g+=data[i+1];
    RGB.b+=data[i+2];
  }


}

RGB.r=~~(RGB.r/count);
RGB.g=~~(RGB.g/count);
RGB.b=~~(RGB.b/count);
return RGB;
};


window.addEventListener( 'load' , function() {
  Vue.prototype.axios = axios;
  let app = new Vue( {
    el: '#app',
    data: {
      pokemons: {},
      moves:{},
      input_pok: {
        NAME: null,
        URLIMG: null,
        TYPE: null,
        FROM:null
      },
      input_mov:{
        NAME:null,
        TYPE:null,
        CAT:null
      },
      editId: null,
      nr_linii:0
    },
    created: function() {
      this.axios.get( '/api/pokemons' )
        .then( (_response) => {
          this.pokemons = _response.data.data;
          for(var i in this.pokemons)this.nr_linii++;

        } );
      this.axios.get( '/api/moves' )
          .then( (_response) => {
            this.moves = _response.data.data;
          } );
    },
    mounted:function(){

      this.$nextTick( ()=>{

        let linii=document.getElementsByClassName("linie_tabel");
        //console.log(linii);
        for(let i=0; i< linii.length;i++){
            console.log(linii[i]);
          linii[i].getElementsByTagName("img")[0].addEventListener( "load" ,  function(){
            console.log("Hei");

            let linie=this.parent.parent;


            let val=get_avarage_RGB(this);
            linie.style.backgroundcolor="rgba("+val.r+","+val.g+","+val.b+",0.5)";
console.log("Hei");


          });


        }


      }  )

  },
    updated:function(){
      this.$nextTick( ()=>{



        let linii=document.getElementsByClassName("linie_tabel");
        //console.log(linii);
        for(let i=0; i< linii.length;i++){
          //console.log(linii[i]);
          linii[i].getElementsByTagName("img")[0].addEventListener( "load" ,  function(){

           // console.log("Hei");
            let val=get_avarage_RGB(this);
           // console.log(val);

            let linie=this.parentElement.parentElement;


            linie.style.backgroundColor="rgba("+val.r+","+val.g+","+val.b+",0.8)";
            //console.log("rgba("+val.r+","+val.g+","+val.b+",0.5)");

          });


        }


      }  )

    },


    methods: {
      eliminare_evolutii:function(nume_din_care_evolueaza,nume_pokemon_de_eliminat){
        for(var i in this.pokemons){
          if(this.pokemons[i].NAME===nume_din_care_evolueaza){
            for(var j=0;j< this.pokemons[i].TO.length;j++){
              if(this.pokemons[i].TO[j]===nume_pokemon_de_eliminat){this.pokemons[i].TO.splice(j,1);
                axios.put( `/api/pokemons/${i}` , this.pokemons[i] );
              }

            }

          }

        }

      },
      eliminare_involutii:function(nume_din_care_evolueaza,nume_pokemon_evolutie){
        for(var i in this.pokemons){
          if(this.pokemons[i].NAME===nume_pokemon_evolutie){
              if(this.pokemons[i].FROM===nume_din_care_evolueaza){this.pokemons[i].FROM=null;
                axios.put( `/api/pokemons/${i}` , this.pokemons[i] );
              }



          }

        }

      },


      eliminare_moves:function(nume_pokemon,nume_miscare){
        for(let i in this.pokemons){
          if(this.pokemons[i].NAME===nume_pokemon){
             for(let j=0;j<this.pokemons[i].moves.length;j++){
               if(this.pokemons[i].moves[j]===nume_miscare){
                 this.pokemons[i].moves.splice(j,1);
                 axios.put( `/api/pokemons/${i}` , this.pokemons[i] )
               }
             }
          }
        }

        for(let i in this.moves){
          if(this.moves[i].NAME===nume_miscare){
            for(let j=0;j<this.moves[i].pokemons.length;j++){
              if(this.moves[i].pokemons[j]===nume_pokemon){
                this.moves[i].pokemons.splice(j,1);
                axios.put( `/api/moves/${i}` , this.moves[i] )
              }
            }
          }
        }


      },

      remove_pok: function( _id ) {
        if(this.pokemons[_id].FROM!=="")this.eliminare_evolutii(this.pokemons[_id].FROM,this.pokemons[_id].NAME);
        console.log(this.pokemons[_id].TO);
        if(this.pokemons[_id].TO.length!==0){
          for(let i=0;i<this.pokemons[_id].TO.length;i++){
            this.eliminare_involutii(this.pokemons[_id].NAME,this.pokemons[_id].TO[i]  );

          }

        }

        for(let i=0;i<this.pokemons[_id].moves.length;i++)this.eliminare_moves(this.pokemons[_id].NAME,this.pokemons[_id].moves[i]);

        this.axios.delete( `/api/pokemons/${_id}` )
          .then( () => {
            Vue.delete( this.pokemons , _id );
          } );
        this.nr_linii--;
      },
      remove_mov:function(_id){
        if(this.moves[_id].pokemons.length!==0){
          for(var i=0;i<this.moves[_id].pokemons.length;i++){
            this.eliminare_moves(this.moves[_id].pokemons[i],this.moves[_id].NAME);

          }


        }

        this.axios.delete(`/api/moves/${_id}`).then(  ()=>{Vue.delete(this.moves,_id);} );

      },
      edit_pok: function( _id ) {
        let io = Object.assign( {} , this.pokemons[_id] );
        this.input_pok = io;
        this.editId = _id;
      },

      verificare_nume:function(a){
        for(var i in this.pokemons){
          if(this.pokemons[i].NAME===a)return false;


        }
        return true;


      },

      adaugare_evolutii:function(name,from){
        for(var i in this.pokemons){

          if(this.pokemons[i].NAME===from){
            let aux=this.pokemons[i].TO.push(name);
            axios.put( `/api/pokemons/${i}` , this.pokemons[i] );
            return;

          }



        }



      },
      verificare_move:function(_id,a){
        for(var i=0;i<this.pokemons[_id].moves.length;i++){
        if(this.pokemons[_id].moves[i]===a)return false;

        }
        return true;

      },

      adaugare_mov:function(_id){
        let optiune=document.getElementsByClassName("act_mov");
        let nr=-1;
        let nr_linie=0;
        for(var i in this.pokemons){
          if(this.pokemons[i].NAME===this.pokemons[_id].NAME){
            nr=nr_linie;
          }
          nr_linie++;
        }

        optiune=optiune[nr].value;
        if(this.verificare_move(_id,optiune)){
          this.pokemons[_id].moves.push(optiune);
          axios.put( `/api/pokemons/${_id}` , this.pokemons[_id] );
          for(let i in this.moves){
            if(this.moves[i].NAME===optiune){
              this.moves[i].pokemons.push(this.pokemons[_id].NAME)
              axios.put( `/api/moves/${i}` , this.moves[i] );

            }

          }

        }


      },

      commit_pok: function() {
        if ( this.editId === null ) {
          // add
          let oo = Object.assign( {} , this.input_pok );
          let tipuri=oo.TYPE;
          if(tipuri===null||tipuri.length===0){
            alert("Un pokemon are cel putin un tip");

            return;
          }else if(tipuri.length>2){
            alert("Un pokemon poate sa aiba maxim doua tipuri");

            return;
          }
          if(this.input_pok.NAME===""){
            alert("Trebuie sa introduci cel putin un nume");

            return;

          }

          if(!this.verificare_nume(this.input_pok.NAME)){
            alert("Nu pot sa existe mai multi Pokemoni cu acest nume");
            return;
          }
          oo.TO=[];
          oo.moves=[];
          this.nr_linii++;

          axios.post( '/api/pokemons' , oo )
            .then( _response => {
              if ( _response.data.ret === "OK" ) {
                Vue.set( this.pokemons , _response.data.id , oo );
                this.adaugare_evolutii(this.input_pok.NAME,this.input_pok.FROM);
                this.input_pok = {
                  NAME: null,
                  URLIMG:null,
                  TYPE: null,
                  FROM:null
                }
              }
            } );

        } else {
          // edit
          for ( let k in this.input_pok ) {
            this.pokemons[this.editId][k] = this.input_pok[k];
          }
          axios.put( `/api/pokemons/${this.editId}` , this.pokemons[this.editId] );
          this.editId = null;
          this.input_pok = {
            NAME: null,
            URLIMG:null,
            TYPE: null,
            FROM:null
          }
        }
      },
      verificare_nume_mov:function(a){
        for(var i in this.moves){
          if(this.moves[i].NAME===a)return false;


        }
        return true;

      },
      commit_mov: function() {
        if ( this.editId === null ) {
          // add
          let oo = Object.assign( {} , this.input_mov );
          if(oo.TYPE===null){
            alert("O miscare are obligatoriu un tip");

            return;
          }
          if(this.input_mov.NAME===""){
            alert("Trebuie sa introduci cel putin un nume");

            return;

          }
          if(!this.verificare_nume_mov(this.input_mov.NAME)){
            alert("Nu pot sa existe mai multi Pokemoni cu acest nume");
            return;
          }
          oo.pokemons=[];

          axios.post( '/api/moves' , oo )
              .then( _response => {
                if ( _response.data.ret === "OK" ) {
                  Vue.set( this.moves , _response.data.id , oo );
                }
                this.input_mov = {
                  NAME: null,
                  TYPE: null,
                  CAT:null
                }
              } );

        } else {
          // edit
          for ( let k in this.input ) {
            this.pokemons[this.editId][k] = this.input_mov[k];
          }
          axios.put( `/api/moves/${this.editId}` , this.pokemons[this.editId] );
          this.editId = null;
          this.input_mov = {
            NAME: null,
            TYPE: null,
            CAT:null
          }
        }
      }
    },

    filters: {
      number: function( _in ) {
        return Number(_in).toFixed(2)
      }
    }
  } );


   var x=localStorage.getItem("logedin");
   if(x===null||x===undefined){
     localStorage.setItem("logedin","false");

   }
     editarebutondreapta();


} );


function myFunction() {
  var checkBox = document.getElementById("involutie");
  var text = document.getElementById("pokinvolutie");

  if (checkBox.checked === true){
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}

