import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, PokemonListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>🔍 Pokémon Explorer</h1>
          <p>Busca cualquier Pokémon por su nombre</p>
        </div>
      </header>

      <main class="main-content">
        <div class="search-section">
          <app-search-bar></app-search-bar>
          
          <!-- Loading indicator -->
          @if (pokemonService.isLoading) {
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p>Buscando Pokémon...</p>
            </div>
          }
          
          <!-- Error message -->
          @if (pokemonService.errorMessage) {
            <div class="error-container">
              <div class="error-message">
                <span class="error-icon">⚠️</span>
                <p>{{ pokemonService.errorMessage }}</p>
                <button class="error-dismiss" (click)="pokemonService.clearState()">
                  Cerrar
                </button>
              </div>
            </div>
          }
        </div>
        
        <div class="pokemon-section">
          <app-pokemon-list></app-pokemon-list>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow-x: hidden;
    }

    .app-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .app-header {
      text-align: center;
      padding: 2rem 1rem;
      position: relative;
      z-index: 1;
    }

    .header-content h1 {
      color: white;
      font-size: 3rem;
      margin: 0;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-content p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.25rem;
      margin: 1rem 0 0 0;
      font-weight: 400;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 200px);
    }

    .search-section {
      flex-shrink: 0;
    }

    .pokemon-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-container {
      text-align: center;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      margin: 2rem auto;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(59, 130, 246, 0.2);
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }

    .loading-container p {
      color: #374151;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
    }

    .error-container {
      text-align: center;
      margin: 2rem auto;
      max-width: 500px;
      padding: 0 1rem;
    }

    .error-message {
      background: rgba(254, 242, 242, 0.95);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(252, 165, 165, 0.5);
      border-radius: 20px;
      padding: 2rem;
      position: relative;
      box-shadow: 0 12px 32px rgba(220, 38, 38, 0.1);
    }

    .error-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    .error-message p {
      color: #dc2626;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .error-dismiss {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
    }

    .error-dismiss:hover {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
    }

    .error-dismiss:active {
      transform: translateY(0);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 1.5rem 0.5rem;
      }
      
      .header-content h1 {
        font-size: 2.25rem;
      }
      
      .header-content p {
        font-size: 1.1rem;
      }
      
      .loading-container,
      .error-container {
        margin: 1rem;
      }
      
      .loading-container {
        padding: 2rem 1.5rem;
      }
      
      .error-message {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .header-content h1 {
        font-size: 2rem;
      }
      
      .header-content p {
        font-size: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'pokemon-explorer';

  constructor(public pokemonService: PokemonService) {}
}
