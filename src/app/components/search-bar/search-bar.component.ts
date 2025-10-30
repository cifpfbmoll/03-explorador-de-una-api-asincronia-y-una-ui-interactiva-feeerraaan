import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-wrapper">
        <div class="search-input-container">
          <div class="search-icon">🔍</div>
          <input
            type="text"
            class="search-input"
            placeholder="Busca un Pokémon por su nombre (ej: pikachu, charmander...)..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (keydown.enter)="onSearch()"
            (focus)="onSearchInput()"
            (blur)="hideSuggestions()"
            [disabled]="pokemonService.isLoading"
          />
          @if (searchQuery) {
            <button
              class="clear-button"
              (click)="clearSearch()"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          }
        </div>
        
        <button
          class="search-button"
          (click)="onSearch()"
          [disabled]="pokemonService.isLoading || !searchQuery.trim()"
        >
          @if (pokemonService.isLoading) {
            <div class="loading-spinner"></div>
          } @else {
            Buscar
          }
        </button>
        
        <!-- Sugerencias -->
        @if (showSuggestions && suggestions.length > 0) {
          <div class="suggestions-dropdown">
            @for (suggestion of suggestions; track suggestion; let i = $index) {
              <div
                class="suggestion-item"
                (mousedown)="selectSuggestion(suggestion)"
              >
                <span class="suggestion-icon">⚡</span>
                <span class="suggestion-text">{{ formatPokemonName(suggestion) }}</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .search-wrapper {
      position: relative;
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-input-container {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .search-input-container:focus-within {
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .search-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
      color: #6b7280;
      transition: color 0.3s ease;
    }

    .search-input-container:focus-within .search-icon {
      color: #3b82f6;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1.1rem;
      background: transparent;
      color: #1f2937;
      font-weight: 500;
    }

    .search-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    .search-input:disabled {
      color: #9ca3af;
      cursor: not-allowed;
    }

    .clear-button {
      background: #ef4444;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .clear-button:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .search-button {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: none;
      border-radius: 50px;
      padding: 0.875rem 2rem;
      color: white;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
      flex-shrink: 0;
    }

    .search-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    .search-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .search-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      margin-top: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-item:hover {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      transform: translateX(4px);
    }

    .suggestion-icon {
      font-size: 1.1rem;
      margin-right: 0.75rem;
      color: #fbbf24;
    }

    .suggestion-text {
      font-size: 1rem;
      font-weight: 500;
      color: #1f2937;
    }

    .suggestion-item:hover .suggestion-text {
      color: #1d4ed8;
    }

    @media (max-width: 768px) {
      .search-wrapper {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .search-input-container {
        padding: 0.625rem 1.25rem;
      }
      
      .search-input {
        font-size: 1rem;
      }
      
      .search-button {
        width: 100%;
        padding: 0.75rem 1.5rem;
      }
      
      .suggestions-dropdown {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .search-container {
        padding: 0 0.5rem;
      }
      
      .search-input::placeholder {
        font-size: 0.9rem;
      }
    }
  `]
})
export class SearchBarComponent {
  searchQuery = '';
  showSuggestions = false;
  suggestions: string[] = [];

  constructor(public pokemonService: PokemonService) {}

  onSearchInput(): void {
    this.suggestions = this.pokemonService.getSuggestions(this.searchQuery);
    this.showSuggestions = this.suggestions.length > 0 && this.searchQuery.length >= 2;
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.showSuggestions = false;
    this.pokemonService.clearState();
    
    this.pokemonService.searchPokemon(query).subscribe({
      next: (pokemon) => {
        this.pokemonService.currentPokemon = pokemon;
        this.pokemonService.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.suggestions = [];
    this.pokemonService.clearState();
  }

  hideSuggestions(): void {
    // Pequeño delay para permitir clicks en sugerencias
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
