[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NJ448ipO)
# 03- Explorador de una API asincronia y una UI interactiva

- **Descripción del Proyecto**: Una aplicación web que permite a los usuarios buscar y explorar una API pública. Incluye una interfaz simple para ingresar consultas de búsqueda, mostrar resultados en tarjetas, y manejar estados como carga, errores o resultados vacíos. Esto es similar al cliente de Reddit que vimos en clase, pero enfocado en la API de GitHub (o lo que surja) para practicar conceptos como solicitudes HTTP y manejo de datos asíncronos.
- **Objetivo**: Ampliar el conocimiento básico de Angular, idealmente para reforzar habilidades en frontend development, API integration y gestión de estado reactivo usando signals.
- **Requisitos Técnicos**:
  - **Framework**: Angular 20.3.7, con énfasis en módulos standalone para componentes reutilizables.
  - **Características Principales**: Utiliza signals para actualizaciones reactivas, servicios para lógica de negocio, y plantillas Angular para UI dinámica. Añade `HttpClientModule` para manejar solicitudes API.
  - **Dependencias**: Mantiene paquetes como `@angular/core` y `rxjs`; incluye `@angular/common/http` para API calls. Usa versiones compatibles con el proyecto actual para evitar conflictos.
  - **API**: PokéAPI REST (https://pokeapi.co/api/v2/), que es gratuita y no requiere autenticación para consultas públicas. Proporciona datos completos de todos los Pokémon incluyendo stats, tipos, sprites, habilidades y más información detallada.
- **Estructura del Proyecto**:
  - **Componentes**: Incluye un componente principal como `pokemon-list.component.ts`, con subcomponentes para tarjetas de Pokémon individuales (`pokemon-card.component.ts`) y detalles. Añade un `search-bar.component.ts` para la búsqueda de usuario con autocompletado.
  - **Servicios**: Un `pokemon.service.ts` que encapsula llamadas API, con métodos como `searchPokemon(query: string)`, `getRandomPokemon()` y `getPokemonByType()` para devolver datos en formato observable.
  - **Plantillas**: Usa directivas como `@if`, `@for` y eventos para una UI interactiva, con estilos CSS modernos para tarjetas de Pokémon, estados de carga, y animaciones de transición.
- **Detalles de la API**: Usa principalmente el endpoint `GET /pokemon/{name or id}` para obtener datos de Pokémon específicos. Ejemplo de llamada: `this.http.get('https://pokeapi.co/api/v2/pokemon/pikachu')`. También utiliza `GET /pokemon?limit=1000` para obtener la lista completa para autocompletado. Incluye manejo robusto de errores HTTP y caché inteligente para mejorar el rendimiento.
- **Características Adicionales**: Para enriquecer el proyecto, se han implementado:
  - **Filtrado por tipo de Pokémon**: Permite filtrar por los 18 tipos diferentes (Fuego, Agua, Planta, etc.)
  - **Sistema de favoritos**: Marcar Pokémon como favoritos con persistencia en localStorage
  - **Modo Shiny**: Toggle para mostrar la versión brillante de los Pokémon
  - **Búsqueda inteligente**: Autocompletado con sugerencias mientras escribes
  - **Estados reactivos**: Manejo completo de loading, error y empty states
  - **Tema claro/oscuro**: Toggle de tema con preferencia guardada
  - **Responsive design**: Adaptable a móviles, tablets y desktop
  - **Caché inteligente**: Evita peticiones duplicadas para mejor rendimiento
  - **Pokémon aleatorios**: Funcionalidad para descubrir Pokémon al azar
  - **Búsquedas rápidas**: Botones para starters, legendarios y populares
 
  # Formato de entrega:

  - Vuestra propuesta de proyecto y documentación del mismo.
  - Para la generación de la documentación está permitida el uso (pero no el abuso) de algunas IAs siempre y cuando reviséis lo que entregáis.
  - El código fuente del proyecto en este repo.
  - Algunas imágenes del funcionamiento de vuestro proyecto en local o en github pages (esto último es totalmente voluntario).
 
 # Fecha de entrega

  - El lunes 3 de noviembre a las 23:59 h.
  - Tened en cuenta la penalización establecida como es habitual.
