
from Models.ArbolDeDecisiones import ArbolDeDecisiones
from Models.ExpectiMax import Expectimax
from Models.Juego import Juego

def main():
    # 1. Definir la baraja inicial
    baraja = [1,2,3,4,5,6,7,8,9,10,10,10,10]*4  # Baraja estándar [8,9]*3
    print("=== ASISTENTE DE BLACKJACK ===")
    print("Baraja inicial:", len(baraja), "cartas")

    # 2. Crear el juego con la baraja y el número de mazos
    juego = Juego(baraja, numeroDeMazos=1)

    juego.obtenerCartasJugador()
    juego.obtenerCartasDealer()

    # Mostrar estado actual
    #juego.mostrarEstadoActual()

    # Verificar si tienes 21
    juego.verificarSiJugadorTiene21()

    # 3. Crear el árbol de decisiones
    arbol = ArbolDeDecisiones(juego)
    arbol.gestionarNodoMax(arbol.nodoRaizMax)

    # 4. Aplicar Expectimax
    expectimax = Expectimax()
    expectimax.aplicarExpectimax(arbol.nodoRaizMax)
    print()

    # 5. ANÁLISIS Y RECOMENDACIÓN    
    # Obtener valores esperados de cada acción
    print("HIT: ", arbol.nodoRaizMax.hijos[0].valor)
    print("STAND: ", arbol.nodoRaizMax.hijos[1].valor)

    #arbol.imprimirArbol(arbol.nodoRaizMax)

if __name__ == "__main__":
    main()