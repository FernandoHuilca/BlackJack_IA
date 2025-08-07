from .Nodo import Nodo
from .TipoNodo import TipoNodo

class ArbolDeDecisiones:
    def __init__(self, juego):
        self.nodoRaizMax = None
        self.iniciarArbol(juego)

    def iniciarArbol(self, juego):
        nuevasCartasJugador = juego.cartasJugador
        nuevasCartasDealer = juego.cartasDealer  # El dealer recibe una carta
        self.nodoRaizMax = Nodo(0.0, nuevasCartasJugador, nuevasCartasDealer, juego.baraja, TipoNodo.MAX, None, [])

    def gestionarNodoMax(self, nodoMax):

        if(len(nodoMax.barajaNodo) == 0):
            if(self.calcularSuma(nodoMax.cartasJugador) > 21):
                self.crearNodoTerminal(-1, nodoMax)
                return
            self.gestionarStand(nodoMax)
            return

        sumaCartasJugador = self.calcularSuma(nodoMax.cartasJugador)
        if (sumaCartasJugador < 21):
            self.gestionarHit(nodoMax)
            nodoExpStand = Nodo(0.0, nodoMax.cartasJugador.copy(), nodoMax.cartasDealer.copy(), nodoMax.barajaNodo.copy(), TipoNodo.EXPSTAND, nodoMax, [])
            nodoMax.hijos.append(nodoExpStand)
            self.gestionarStand(nodoExpStand)
        elif (sumaCartasJugador == 21):
            nodoExpStand = Nodo(0.0, nodoMax.cartasJugador.copy(), nodoMax.cartasDealer.copy(), nodoMax.barajaNodo.copy(), TipoNodo.EXPSTAND, nodoMax, [])
            nodoMax.hijos.append(nodoExpStand)
            self.gestionarStand(nodoExpStand)
        else:
            self.crearNodoTerminal(-1, nodoMax)           

    def gestionarHit(self, nodoMax):
        nodoExpHit = Nodo(0.0, nodoMax.cartasJugador.copy(), nodoMax.cartasDealer.copy(), nodoMax.barajaNodo.copy(), TipoNodo.EXPHIT, nodoMax, [])
        nodoMax.hijos.append(nodoExpHit)

        for i, carta in enumerate(nodoExpHit.barajaNodo):
            # Nueva baraja sin la carta actual
            nuevaBaraja = nodoExpHit.barajaNodo.copy()
            nuevaBaraja.pop(i)

            # Jugador recibe esa carta
            nuevasCartasJugador = nodoExpHit.cartasJugador.copy() + [carta]
            sumaCartasJugador = self.calcularSuma(nuevasCartasJugador)

            nodoMaxHijo = Nodo(0.0, nuevasCartasJugador, nodoExpHit.cartasDealer.copy(), nuevaBaraja, TipoNodo.MAX, nodoExpHit, [])
            nodoExpHit.hijos.append(nodoMaxHijo)
            
            # Continuar el juego desde el nuevo estado
            self.gestionarNodoMax(nodoMaxHijo)

    def gestionarStand(self, nodoMax):
        sumaCartasJugador = self.calcularSuma(nodoMax.cartasJugador)
        sumaCartasDealer = self.calcularSuma(nodoMax.cartasDealer)

        if sumaCartasDealer >= 17:
            if sumaCartasDealer > 21:
                resultado = 1.0 if sumaCartasJugador <= 21 else -1.0
            elif sumaCartasDealer > sumaCartasJugador:
                resultado = -1.0
            elif sumaCartasDealer == sumaCartasJugador:
                resultado = 0.0
            else:
                resultado = 1.0 if sumaCartasJugador <= 21 else -1.0

            self.crearNodoTerminal(resultado, nodoMax)
            return
            
        # Dealer debe seguir tomando cartas (suma < 17)
        if len(nodoMax.barajaNodo) == 0:
            # No hay más cartas - evaluar con cartas actuales
            if sumaCartasDealer > sumaCartasJugador:
                resultado = -1.0
            elif sumaCartasDealer == sumaCartasJugador:
                resultado = 0.0
            else:
                resultado = 1.0 if sumaCartasJugador <= 21 else -1.0

            self.crearNodoTerminal(resultado, nodoMax)
            return
        
        
        # Por cada carta posible que puede recibir el dealer
        for i, carta in enumerate(nodoMax.barajaNodo):
            # Crear nueva baraja sin esta carta
            nuevaBaraja = nodoMax.barajaNodo.copy()
            nuevaBaraja.pop(i)

            # Dealer recibe la carta
            nuevasCartasDealer = nodoMax.cartasDealer.copy() + [carta]

            # Crear nodo hijo que representa este estado (sigue siendo un proceso del dealer, no del jugador, por eso no es un nodo MAX)
            nodoHijoStand = Nodo(0, nodoMax.cartasJugador.copy(), nuevasCartasDealer, nuevaBaraja, TipoNodo.EXPSTAND, nodoMax, [])
            nodoMax.hijos.append(nodoHijoStand)

            self.gestionarStand(nodoHijoStand)

    def crearNodoTerminal(self, valor, nodoExp):

        nodoTerminal = Nodo(valor, nodoExp.cartasJugador.copy(), nodoExp.cartasDealer.copy(), nodoExp.barajaNodo.copy(), TipoNodo.TERMINAL, nodoExp, [])
        nodoExp.hijos.append(nodoTerminal)

    def calcularSuma(self, cartas):
        suma = sum(cartas)
        numeroDeAses = cartas.count(1)
        while suma <= 11 and numeroDeAses > 0:
            suma += 10  # Cambiar un As de 1 a 11
            numeroDeAses -= 1
        return suma
    
    def imprimirArbol(self, nodo, nivel=0):
        indentacion = "    " * nivel
        print(f"{indentacion}Valor: {nodo.valor}, Tipo: {nodo.tipoDeNodo}")
        print(f"{indentacion}Jugador: {nodo.cartasJugador} (suma: {self.calcularSuma(nodo.cartasJugador)})")
        print(f"{indentacion}Dealer: {nodo.cartasDealer} (suma: {self.calcularSuma(nodo.cartasDealer)})")
        print(f"{indentacion}Baraja restante: {nodo.barajaNodo}")
        print()

        for hijo in nodo.hijos:
            self.imprimirArbol(hijo, nivel + 1)