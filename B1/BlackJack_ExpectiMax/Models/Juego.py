class Juego:
    def __init__(self, baraja, numeroDeMazos=1):
        self.baraja = baraja * numeroDeMazos
        self.cartasJugador = []
        self.cartasDealer = []
    
    def obtenerCartasJugador(self):
        # Obtener cartas del jugador
        print("\nIngresa las cartas del jugador (separadas por comas):")
        cartasJugador = input().strip().split(',')
        for carta in cartasJugador:
            carta_int = int(carta.strip())
            if carta_int in self.baraja:
                self.baraja.remove(carta_int)
                self.cartasJugador.append(carta_int)
            else:
                print(f"La carta {carta_int} no está disponible en la baraja")

    def obtenerCartasDealer(self):
        # Obtener carta del dealer
        print("\nIngresa la carta visible del dealer:")
        cartaDealer = int(input().strip())
        if cartaDealer in self.baraja:
            self.baraja.remove(cartaDealer)
            self.cartasDealer.append(cartaDealer)
        else:
            print(f"La carta {cartaDealer} no está disponible en la baraja")

    def mostrarEstadoActual(self):
        print(f"\n=== ESTADO ACTUAL ===")
        suma_jugador = self.calcularSuma(self.cartasJugador)
        suma_dealer = self.calcularSuma(self.cartasDealer)
        print(f"Cartas Jugador: {self.cartasJugador} (Suma: {suma_jugador})")
        print(f"Carta del dealer: {self.cartasDealer} (Suma: {suma_dealer})")
        print(f"Cartas restantes en baraja: {len(self.baraja)}")
    
    def verificarSiJugadorTiene21(self):
        suma_jugador = self.calcularSuma(self.cartasJugador)
        if suma_jugador == 21:
            print(f"BLACKJACK!!! Suma = {suma_jugador}")
    
    def calcularSuma(self,cartas):
        suma = sum(cartas)
        numeroDeAses = cartas.count(1)
        while suma <= 11 and numeroDeAses > 0:
            suma += 10  # Cambiar un As de 1 a 11
            numeroDeAses -= 1
        return suma