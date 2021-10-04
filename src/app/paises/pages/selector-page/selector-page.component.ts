import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { map, switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {

  miFormulario : FormGroup = this.fb.group({
    region     : [ '', Validators.required ],
    pais       : [ '', Validators.required ],
    frontera   : [ '', Validators.required ],
  })

  // llenar selectores
  regiones  : string[] = [];
  paises    : PaisSmall[] = [];
  /* fronteras : string[] = []; */
  fronteras : PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  /* spellings : Pais[] = []; */

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

      /* PARA CADA CAMBIO DE REGION */
      this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          } ),
          switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
        )
        .subscribe( paises => {

          console.log( paises );
          this.paises = paises;
          this.cargando = false;
        } )

      /* PARA CADA CAMBIO DE PAIS */
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.cargando = true;
            this.fronteras = [];
            this.miFormulario.get( 'frontera' )?.reset('');
          } ),
          switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
          switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
        )
        .subscribe( paises => {

          console.log(paises);
          /* this.fronteras = pais?.borders || []; */
          this.fronteras = paises;
          this.cargando = false;
        } )




  }

  guardar() {
    console.log(this.miFormulario.value)
  }



}
