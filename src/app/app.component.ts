import { Component, ɵConsole, ElementRef } from "@angular/core";
import { ViewChild } from "@angular/core";
import { GoogleServiceService } from "./service/google-service.service";
import { GestartServicesService } from "./service/gestart-services.service";
import alasql from 'alasql';
import { Chart } from 'chart.js';

import {} from "googlemaps";
interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("gmap", { static: true }) gmapElement: any;
  @ViewChild('myCanvas') canvasRef: ElementRef;
  constructor(
    private googleMapsService: GoogleServiceService,
    private gestartService: GestartServicesService
  ) {}
  chart = [];

  latitude: any;
  longitude: any;
  qtdPessoa: any = 3.5;
  qtdPublico: any;
  qtdUnidade: any;
  endereco: any;
  novo_endereco: any;
  distancia: any;
  locations = [];
  locationsFornecedores = [];
  tipoBusca: any = "geocode";
  markers: google.maps.Marker[] = [];
  bairros: any = [];
  expanded: any = 1;



  selectedMarkerType: string = "";

  isHidden = false;
  lat: any;
  lng: any;
  map: google.maps.Map;
  switchValue: any = "false";
  totalBairros: any;



  ngOnInit() {
    this.pegarLocalizacaoAtual();
  }



  ngAfterContentInit() {
    let mapProp = {
      center: new google.maps.LatLng(-3.747452, -38.510713),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.addListaFornecedores();


  }

  getAddress(place: object) {
    this.endereco = place["formatted_address"];
  }
  mudarTipoBusca(e) {
    this.endereco = "";
    this.tipoBusca = e.target.value;
    this.googleMapsService.tipoDeVisualizacao.next(this.tipoBusca);
  }

  pegarLocalizacaoAtual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    } else {
      console.log("User not allow");
    }
  }
  arrayFornecedores = [{
    "NOME": "ACAL - ALDEOTA",
    "END": "Av. Desembargador Moreira, 2211",
    "BAI": "Aldeota",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.7450042,
    "LNG": -38.5006016,

  },{
    "NOME": "ACAL - CAUCAIA",
    "END": "Rua Coronel Correia, 2273 (Br 222)",
    "BAI": "Parque Soledade",
    "CIDADE": "Caucaia",
    "ESTADO": "CE",
    "LAT": -3.7352681,
    "LNG": -38.6671176,
  },{
    "NOME": "ACAL - MESSEJANA",
    "END": "Av. Washington Soares, 10008",
    "BAI": "Messejana",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.8367335,
    "LNG": -38.4821537,
  },{
    "NOME": "ACAL - PARANGABA",
    "END": "Av. Godofredo Maciel, 767",
    "BAI": "Parangaba",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.7831617,
    "LNG": -38.5655484,
  },{
    "NOME": "ACAL - CENTRO",
    "END": "Av. Tristão Gonçalves, 1074",
    "BAI": "Centro",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7306511,
    "LNG": -38.5346644,
  },{
    "NOME": "ACAL - LOJA CONCEITO",
    "END": "Av. Antônio Sales, 3210",
    "BAI": "Aldeota",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.747895,
    "LNG": -38.4954666,
  },{
    "NOME": "ACAL - MARACANAÚ",
    "END": "Av. Padre José Holanda do Vale",
    "BAI": "Quadra 77",
    "CIDADE": "Maracanaú",
    "ESTADO": "CE",
    "LAT": -3.860312,
    "LNG": -38.6365054,
  },{
    "NOME": "ACAL - ADMINISTRAÇÃO",
    "END": "Rua Padre Cícero, 400",
    "BAI": "Rodolfo Teófilo",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7433572,
    "LNG": -38.5458743,
  },{
    "NOME": "ACAL - CENTRO DE DISTRIBUIÇÃO",
    "END": "Rua Pastor Samuel Munguba, 360",
    "BAI": "Rodolfo Teófilo",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7443466186523438,
    "LNG": -38.546321868896484,
  }]

  prepararEndereco() {
    this.deleteMarkers()
    this.novo_endereco = this.endereco.split(" ").join("+");
    this.googleMapsService
      .converterEndereco(this.novo_endereco)
      .subscribe((data) => {
        this.latitude = parseFloat(
          data["results"][0]["geometry"]["location"]["lat"].toString()
        );
        this.longitude = parseFloat(
          data["results"][0]["geometry"]["location"]["lng"].toString()
        );

        this.condominiosRaio();
      });
      this.addListaFornecedores();
  }

  condominiosRaio() {
    this.gestartService
      .buscarCondominios(this.latitude, this.longitude, this.distancia)
      .subscribe((data) => {
        this.addListaCondominios(data);
       this.bairros = alasql('select BAICON, SUM(QTDE_UNIDADES) as UNIDADES from ? GROUP BY BAICON', [data]);

        this.setCenter();
      });

  }

  addListaCondominios(data) {
    this.locations = [];
    this.qtdUnidade = 0;
    for (let i = 0; i < data.length; i++) {
      this.qtdUnidade += parseInt(data[i]["QTDE_UNIDADES"]);
      let location = new google.maps.LatLng(data[i]["LAT"], data[i]["LNG"]);
      this.locations.push(data[i]);
      this.addMarker(location,i);
    }
    this.qtdPublico = this.qtdPessoa * this.qtdUnidade;
  }

  addListaFornecedores() {
    this.locationsFornecedores = [];
    for (let i = 0; i < this.arrayFornecedores.length; i++) {
      let location = new google.maps.LatLng(this.arrayFornecedores[i]["LAT"], this.arrayFornecedores[i]["LNG"]);
      this.locationsFornecedores.push(this.arrayFornecedores[i]);
      this.addMarkerFornecedor(location,i);
    }

  }


  inserirInfoWindow(index, marker,map){
    let nome = this.locations[index]["NOMCON"];
    let bairro = this.locations[index]["BAICON"];
    let distancia =  Math.round(parseFloat(this.locations[index]["DISTANCIA"].toString()));
    let unidades =  this.locations[index]["QTDE_UNIDADES"];
    let publico =  Math.round(unidades * this.qtdPessoa);

   var contentString = `<div id="iw-container">
   <div class="iw-title">${nome}</div>
   <div class="iw-content">
     <div>Bairro: ${bairro}</div>
     <div>Encontra-se a ${distancia}km de distacia do ponto determinado, </div>

     <p>atualmente conta com ${unidades} unidades, alcançando uma média de ${publico} pessoas</p>

 </div>`;

   var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map,marker);
    });
    marker.addListener('mouseout', function() {
      infowindow.close();
  });
  }
  inserirInfoWindowFornecedores(index, marker,map){
    let tituloAcal = this.arrayFornecedores[index].NOME;


   var contentString = `<div id="iw-container">
     <div style="width:200px">${tituloAcal}</div>


 </div>`;

   var infowindow = new google.maps.InfoWindow({

      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map,marker);
    });
    marker.addListener('mouseout', function() {
      infowindow.close();
  });
  }

  addMarkerFornecedor(location, index) {

    const aa =   new google.maps.Marker({
       position: location,
       map: this.map,
       icon: "assets/icon-acal.png",
     });

    this.inserirInfoWindowFornecedores(index, aa, this.map);

    }


   addMarker(location, index) {
   const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: "assets/iconverde.png",

      title:  this.locations[index]["NOMCON"].toString() + " " +
      "|" + " " +
      this.locations[index]["QTDE_UNIDADES"].toString(),

    });
    this.markers.push(marker);
    this.inserirInfoWindow(index, marker, this.map);


  }



  centersMarkers: google.maps.Marker[] = [];
  setCenter() {


    this.map.setCenter(null);
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    let location = new google.maps.LatLng(this.latitude, this.longitude);
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: "Você!",
      icon: "assets/logo.png",

       animation: google.maps.Animation.BOUNCE,
    });
    this.centersMarkers.push(marker);

  }

  setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
    for (let i = 0; i < this.centersMarkers.length; i++) {
      this.centersMarkers[i].setMap(map);
    }
  }
  hideMarkers(): void {
    this.setMapOnAll(null);
  }

   deleteMarkers(): void {
    this.hideMarkers();
    this.markers = [];
  }



  /* addMaker() {
    for (let i = 0; i < this.locations.length; i++) {
      console.log(this.locations[i]);
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat(this.locations[i]["LAT"].toString()),
          parseFloat(this.locations[i]["LNG"].toString())
        ),
        title:
          this.locations[i]["NOMCON"].toString() +
          "|" +
          this.locations[i]["QTDE_UNIDADES"].toString(),
        map: this.map,
        icon: "assets/logo.png",
      });
    }
  }*/





  clearMarkers() {
    this.setMapOnAll(null);
  }
}
