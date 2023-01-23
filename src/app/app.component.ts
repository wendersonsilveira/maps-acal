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
    "NOME": "LOJA ANTÔNIO SALES",
    "END": "Av. Antônio Sales, 3410",
    "BAI": " Dionísio Torres",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.74835765,
    "LNG": -38.4941849,

  },{
    "NOME": "LOJA BEZERRA DE MENEZES",
    "END": "Av. Bezerra de Menezes, 78",
    "BAI": "Monte Castelo",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7313592499999997,
    "LNG": -38.545811839337205,
  },{
    "NOME": "ACAL - MESSEJANA",
    "END": "Av. Washington Soares, 10008",
    "BAI": "Messejana",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.8367335,
    "LNG": -38.4821537,
  },{
    "NOME": "LOJA WASHINGTON SOARES",
    "END": "Av. Washington Soares, 1500",
    "BAI": "Parangaba",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.7662711,
    "LNG": -38.4823555,
  },{
    "NOME": "LOJA SANTOS DUMONT",
    "END": "Av. Santos Dumont, 3870",
    "BAI": "Aldeota",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7397661,
    "LNG": -38.4893363,
  },{
    "NOME": "LOJA CAMBEBA",
    "END": "Av. Washington Soares, 4900",
    "BAI": "Cambeba",
    "CIDADE": "FORTALEZA",
    "ESTADO": "CE",
    "LAT": -3.802616,
    "LNG": -38.479577,
  },{
    "NOME": "LOJA OUTLET MARACANAÚ",
    "END": "Av. Dr. Mendel Steinbruch, 2595",
    "BAI": "Pajuçara",
    "CIDADE": "Maracanaú",
    "ESTADO": "CE",
    "LAT": -3.8514010082908485,
    "LNG": -38.58686156582709,
  },{
    "NOME": "LOJA PREMI1",
    "END": "Av. Antônio Sales, 3107",
    "BAI": "Dionísio Torres",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.746999467476362,
    "LNG": -38.49624447332083,
  },{
    "NOME": "LOJA JUAZEIRO DO NORTE",
    "END": "Av. Padre Cícero, 2241",
    "BAI": "Salesianos",
    "CIDADE": "Juazeiro do Norte",
    "ESTADO": "CE",
    "LAT": -7.219209544035988,
    "LNG": -39.32415518865255,
  },{
    "NOME": "LOJA EUSÉBIO",
    "END": "Av Farias Brito, S/N",
    "BAI": "Amador",
    "CIDADE": "Eusébio",
    "ESTADO": "CE",
    "LAT": -3.864302785722653,
    "LNG": -38.46814647317725,
  },{
    "NOME": "LOJA JÓQUEI",
    "END": "Av. Senador Fernandes Távora, 84",
    "BAI": "Salesianos",
    "CIDADE": "Juazeiro do Norte",
    "ESTADO": "CE",
    "LAT": -3.7659193782356493,
    "LNG": -38.57420353099291,
  },{
    "NOME": "LOJA MARACANAÚ - SHOPPING PITAGUARY",
    "END": "Av. Padre Cícero, 2241",
    "BAI": "Salesianos",
    "CIDADE": "Juazeiro do Norte",
    "ESTADO": "CE",
    "LAT": -3.8721394473038067,
    "LNG": -38.62150237749936,
  },{
    "NOME": "CD – CENTRO DE DISTRIBUIÇÃO",
    "END": "Rua Cruzeiro,1115",
    "BAI": "CENTRO",
    "CIDADE": "MARACANAU",
    "ESTADO": "CE",
    "LAT": -3.866785631021157,
    "LNG": -38.50743895797618,
  },{
    "NOME": "LOJA MARAPONGA",
    "END": "Av. Godofredo Maciel, 2560",
    "BAI": "Maraponga",
    "CIDADE": "Fortaleza",
    "ESTADO": "CE",
    "LAT": -3.7977690892365685,
    "LNG": -38.57063241349188,
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

     <p>atualmente conta com ${unidades} funcionários.</p>

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
       icon: "assets/icon-normaltel.png",
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


  clearMarkers() {
    this.setMapOnAll(null);
  }
}
