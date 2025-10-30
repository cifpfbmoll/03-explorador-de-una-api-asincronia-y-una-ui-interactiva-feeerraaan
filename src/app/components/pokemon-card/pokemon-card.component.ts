import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="pokemon-card" 
      [class.shiny]="isShiny"
      (click)="onCardClick()"
      [attr.data-type]="getPrimaryType()"
    >
      <div class="pokemon-image-container">
        <img
          [src]="getImageUrl()"
          [alt]="pokemon.name"
          class="pokemon-image"
          (error)="onImageError($event)"
          loading="lazy"
        />
        <div class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</div>
        @if (isShiny) {
          <div class="shiny-indicator">✨</div>
        }
      </div>

      <div class="pokemon-info">
        <h3 class="pokemon-name">{{ pokemon.name | titlecase }}</h3>
        
        <div class="pokemon-types">
          @for (type of pokemon.types; track type.type.name) {
            <span 
              class="type-badge"
              [style.background-color]="pokemonService.getTypeColor(type.type.name)"
            >
              {{ type.type.name | titlecase }}
            </span>
          }
        </div>

        <div class="pokemon-stats-preview">
          <div class="stat-item">
            <span class="stat-label">HP</span>
            <span class="stat-value">{{ getStatValue('hp') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">ATK</span>
            <span class="stat-value">{{ getStatValue('attack') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">DEF</span>
            <span class="stat-value">{{ getStatValue('defense') }}</span>
          </div>
        </div>

        <div class="pokemon-physical">
          <div class="physical-item">
            <span>Height: {{ pokemon.height / 10 }}m</span>
          </div>
          <div class="physical-item">
            <span>Weight: {{ pokemon.weight / 10 }}kg</span>
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button 
          class="action-btn details-btn"
          (click)="onDetailsClick($event)"
          title="View details"
        >
          👁️
        </button>
        <button 
          class="action-btn favorite-btn"
          [class.favorited]="isFavorited"
          (click)="onFavoriteClick($event)"
          title="Add to favorites"
        >
          {{ isFavorited ? '❤️' : '🤍' }}
        </button>
        <button 
          class="action-btn shiny-btn"
          (click)="toggleShiny($event)"
          title="Toggle shiny"
        >
          ✨
        </button>
      </div>

      <!-- Hover overlay with additional info -->
      <div class="hover-overlay">
        <div class="abilities">
          <strong>Abilities:</strong>
          @for (ability of pokemon.abilities.slice(0, 2); track ability.ability.name) {
            <span class="ability-name">{{ ability.ability.name | titlecase }}</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-card {
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
    }

    .pokemon-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 20px 25px rgba(0, 0, 0, 0.15),
        0 10px 10px rgba(0, 0, 0, 0.04);
      border-color: var(--type-color, #4caf50);
    }

    .pokemon-card.shiny {
      background: linear-gradient(145deg, #fff8e1, #f3e5ab);
      border: 2px solid #ffd700;
      box-shadow: 
        0 4px 6px rgba(255, 215, 0, 0.3),
        0 1px 3px rgba(255, 215, 0, 0.2);
    }

    .pokemon-card[data-type="fire"] { --type-color: #F08030; }
    .pokemon-card[data-type="water"] { --type-color: #6890F0; }
    .pokemon-card[data-type="grass"] { --type-color: #78C850; }
    .pokemon-card[data-type="electric"] { --type-color: #F8D030; }
    .pokemon-card[data-type="psychic"] { --type-color: #F85888; }
    .pokemon-card[data-type="ice"] { --type-color: #98D8D8; }
    .pokemon-card[data-type="dragon"] { --type-color: #7038F8; }
    .pokemon-card[data-type="dark"] { --type-color: #705848; }
    .pokemon-card[data-type="fairy"] { --type-color: #EE99AC; }
    .pokemon-card[data-type="fighting"] { --type-color: #C03028; }
    .pokemon-card[data-type="poison"] { --type-color: #A040A0; }
    .pokemon-card[data-type="ground"] { --type-color: #E0C068; }
    .pokemon-card[data-type="flying"] { --type-color: #A890F0; }
    .pokemon-card[data-type="bug"] { --type-color: #A8B820; }
    .pokemon-card[data-type="rock"] { --type-color: #B8A038; }
    .pokemon-card[data-type="ghost"] { --type-color: #705898; }
    .pokemon-card[data-type="steel"] { --type-color: #B8B8D0; }
    .pokemon-card[data-type="normal"] { --type-color: #A8A878; }

    .pokemon-image-container {
      position: relative;
      text-align: center;
      margin-bottom: 1rem;
    }

    .pokemon-image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      transition: transform 0.3s ease;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .pokemon-card:hover .pokemon-image {
      transform: scale(1.1) rotate(5deg);
    }

    .pokemon-id {
      position: absolute;
      top: -10px;
      right: -10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .shiny-indicator {
      position: absolute;
      top: -10px;
      left: -10px;
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      padding: 0.25rem;
      border-radius: 50%;
      font-size: 1rem;
      animation: sparkle 2s ease-in-out infinite;
    }

    @keyframes sparkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }

    .pokemon-info {
      text-align: center;
    }

    .pokemon-name {
      margin: 0 0 0.5rem 0;
      font-size: 1.4rem;
      font-weight: bold;
      color: #333;
      text-transform: capitalize;
    }

    .pokemon-types {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .pokemon-stats-preview {
      display: flex;
      justify-content: space-around;
      margin-bottom: 1rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      padding: 0.5rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.7rem;
      color: #666;
      font-weight: bold;
    }

    .stat-value {
      display: block;
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }

    .pokemon-physical {
      display: flex;
      justify-content: space-around;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .card-actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .pokemon-card:hover .card-actions {
      opacity: 1;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .action-btn:hover {
      background: white;
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .favorite-btn.favorited {
      background: #ffebee;
      border-color: #e91e63;
    }

    .hover-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      color: white;
      padding: 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .pokemon-card:hover .hover-overlay {
      transform: translateY(0);
    }

    .abilities {
      font-size: 0.9rem;
    }

    .ability-name {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      margin: 0.2rem;
    }

    @media (max-width: 768px) {
      .pokemon-card {
        padding: 1rem;
      }

      .pokemon-image {
        width: 100px;
        height: 100px;
      }

      .pokemon-name {
        font-size: 1.2rem;
      }

      .pokemon-stats-preview {
        flex-direction: column;
        gap: 0.5rem;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-actions {
        opacity: 1;
      }

      .hover-overlay {
        position: static;
        transform: none;
        background: rgba(0, 0, 0, 0.1);
        color: #333;
        margin-top: 1rem;
      }
    }
  `]
})
export class PokemonCardComponent {
  @Input({ required: true }) pokemon!: Pokemon;
  @Input() isFavorited = false;
  @Input() isShiny = false;
  
  @Output() cardClick = new EventEmitter<Pokemon>();
  @Output() detailsClick = new EventEmitter<Pokemon>();
  @Output() favoriteClick = new EventEmitter<Pokemon>();
  @Output() shinyToggle = new EventEmitter<{ pokemon: Pokemon; isShiny: boolean }>();

  constructor(public pokemonService: PokemonService) {}

  onCardClick(): void {
    this.cardClick.emit(this.pokemon);
  }

  onDetailsClick(event: Event): void {
    event.stopPropagation();
    this.detailsClick.emit(this.pokemon);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.pokemon);
  }

  toggleShiny(event: Event): void {
    event.stopPropagation();
    this.isShiny = !this.isShiny;
    this.shinyToggle.emit({ pokemon: this.pokemon, isShiny: this.isShiny });
  }

  getImageUrl(): string {
    if (this.isShiny && this.pokemon.sprites.front_shiny) {
      return this.pokemon.sprites.front_shiny;
    }
    return this.pokemonService.getImageUrl(this.pokemon);
  }

  getStatValue(statName: string): number {
    const stat = this.pokemon.stats.find(s => s.stat.name === statName);
    return stat?.base_stat || 0;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Intentar con la imagen de alta calidad oficial si la actual falla
    if (!img.src.includes('official-artwork')) {
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon.id}.png`;
    } else if (!img.src.includes('front_default')) {
      // Si la oficial también falla, usar sprite normal
      img.src = this.pokemon.sprites.front_default || '';
    } else {
      // Si todo falla, usar un placeholder con SVG
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qb2vDqW1vbiAjPC90ZXh0Pgo8L3N2Zz4=';
    }
  }

  getPrimaryType(): string {
    return this.pokemon.types[0]?.type.name || 'normal';
  }
}
