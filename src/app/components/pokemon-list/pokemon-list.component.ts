import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  template: `
    <div class="pokemon-list" *ngIf="pokemonService.currentPokemon">
      <h2>Información del Pokémon</h2>
      <div class="pokemon-grid">
        <app-pokemon-card 
          [pokemon]="pokemonService.currentPokemon">
        </app-pokemon-card>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-list {
      margin: 2rem 0;
    }

    .pokemon-list h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .pokemon-grid {
        grid-template-columns: 1fr;
        padding: 0 0.5rem;
      }
    }
  `]
})
export class PokemonListComponent {
  
  constructor(public pokemonService: PokemonService) {}
}
