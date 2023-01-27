/**
 * Dependency Injection Principle
 * Princípio da inversão de controle
 */

// * Tipos para abstrações
type AbstractType<T> = abstract new (...params: unknown[]) => T

// * Tipos para classes responsáveis
interface TypeOf<T> extends Function {
  new (...params: unknown[]): T
}

// * Container de dependências
const container = new Map()

/**
 * Registra dependências
 *
 * @param type {AbstractType<T>} Abstração
 * @param concrete {TypeOf<T>} Classe responsável
 */
export function setProvider<T>(type: AbstractType<T>, concrete: TypeOf<T>) {
  container.set(type, concrete)
}

/**
 * Solicita uma dependência
 * @param type {AbstractType<T>} Abstração
 * @returns {T} Classe responsável
 */
export function useProvider<T>(type: AbstractType<T>): T {
  const concrete = container.get(type)

  if (!concrete) {
    throw new Error(`O tipo ${type.name} não está registrado`)
  }

  return new concrete()
}
