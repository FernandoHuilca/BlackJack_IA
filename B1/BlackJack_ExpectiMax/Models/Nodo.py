class Nodo:
    def __init__(self, valor, cartasJugador, cartasDealer, barajaNodo, tipoDeNodo, padre, hijos):
        self.valor = valor
        self.cartasJugador = cartasJugador
        self.cartasDealer = cartasDealer
        self.barajaNodo = barajaNodo
        self.tipoDeNodo = tipoDeNodo
        self.padre = padre
        self.hijos = hijos