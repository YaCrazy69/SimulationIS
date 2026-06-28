from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP, getcontext

# Précision interne suffisante pour RK4 sans explosion de mantisse
getcontext().prec = 28

QUANT = Decimal("0.000001")  # 6 décimales


def en_decimal(valeur):
    if isinstance(valeur, timedelta):
        return Decimal(str(valeur.total_seconds()))
    return Decimal(str(valeur))


def arrondir(valeur: Decimal) -> Decimal:
    """Arrondit à 6 décimales. Utilise float→str pour éviter InvalidOperation
    sur des Decimal à mantisse excessivement longue."""
    return Decimal(f"{float(valeur):.6f}")


def derive(volume: Decimal) -> Decimal:
    """dV/dt = -0.05 * V  (décroissance exponentielle, taux 5 %/s)"""
    return volume * Decimal("-0.05")


def runge_kutta(volume: Decimal, dt: Decimal) -> Decimal:
    """Un pas RK4. Renvoie le nouveau volume arrondi à 6 décimales."""
    k1 = dt * derive(volume)
    k2 = dt * derive(volume + k1 / Decimal("2"))
    k3 = dt * derive(volume + k2 / Decimal("2"))
    k4 = dt * derive(volume + k3)
    nouveau = volume + (k1 + Decimal("2") * k2 + Decimal("2") * k3 + k4) / Decimal("6")
    # Arrondir après chaque pas pour stopper la croissance de la mantisse
    return arrondir(nouveau)


def calculer_points(volume_initial, duree, pas):
    """
    Génère les points de simulation par méthode Runge-Kutta d'ordre 4.

    Paramètres
    ----------
    volume_initial : nombre initial en m³ (hardcodé à 5000 dans le service)
    duree          : durée totale en secondes (timedelta ou nombre)
    pas            : intervalle de temps en secondes (Decimal ou nombre)

    Retourne
    --------
    Liste de dicts {temps, volume, niveau} avec valeurs arrondies à 6 décimales.
    """
    volume   = arrondir(en_decimal(volume_initial))
    duree_s  = en_decimal(duree)
    pas_s    = en_decimal(pas)
    temps    = Decimal("0")

    nb_points = int(duree_s / pas_s)
    points = []

    for i in range(nb_points + 1):
        points.append({
            "temps":  float(temps),                          # secondes
            "volume": float(volume),                         # m³
            "niveau": float(arrondir(volume / Decimal("1000"))),  # m³ (niveau = vol/1000)
        })
        if i == nb_points:
            break
        volume = runge_kutta(volume, pas_s)
        temps  = arrondir(temps + pas_s)

    return points
