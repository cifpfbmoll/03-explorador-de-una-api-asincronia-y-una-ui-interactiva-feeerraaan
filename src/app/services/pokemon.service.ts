import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Pokemon } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  
  // Estado simple sin signals
  currentPokemon: Pokemon | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  pokemonNames: string[] = [];
  
  constructor(private http: HttpClient) {
    this.loadPokemonNames();
  }

  /**
   * Carga la lista de nombres de Pokémon para autocompletado
   */
  private loadPokemonNames(): void {
    this.http.get<any>(`${this.baseUrl}/pokemon?limit=1000`).subscribe({
      next: (response) => {
        this.pokemonNames = response.results.map((p: any) => p.name);
      },
      error: (error) => {
        console.error('Error loading Pokemon names:', error);
      }
    });
  }

  /**
   * Busca un Pokémon por nombre
   */
  searchPokemon(query: string): Observable<Pokemon> {
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (!lowercaseQuery) {
      return throwError(() => new Error('El nombre no puede estar vacío'));
    }

    this.isLoading = true;
    this.errorMessage = null;

    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${lowercaseQuery}`)
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          let errorMessage = '';
          
          if (error.status === 404) {
            errorMessage = `Pokémon "${query}" no encontrado. Verifica el nombre.`;
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu internet.';
          } else {
            errorMessage = 'Ocurrió un error inesperado.';
          }
          
          this.errorMessage = errorMessage;
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Obtiene la URL de la imagen del Pokémon
   */
  getImageUrl(pokemon: Pokemon): string {
    return pokemon.sprites.other?.['official-artwork']?.front_default ||
           pokemon.sprites.front_default ||
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }

  /**
   * Obtiene el color del tipo de Pokémon
   */
  getTypeColor(typeName: string): string {
    const typeColors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    
    return typeColors[typeName] || '#68A090';
  }

  /**
   * Obtiene sugerencias de nombres de Pokémon
   */
  getSuggestions(query: string): string[] {
    if (!query || query.length < 2) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return this.pokemonNames
      .filter(name => name.toLowerCase().includes(lowercaseQuery))
      .slice(0, 5);
  }

  /**
   * Limpia el estado
   */
  clearState(): void {
    this.currentPokemon = null;
    this.errorMessage = null;
    this.isLoading = false;
  }
}
