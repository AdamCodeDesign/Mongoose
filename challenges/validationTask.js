/* 
    1. Napisz schemat opisujący fundację z wolontariuszami. Fundacja ma następujące pola:
       - name - String z walidacją gdzie w nazwie musi pojawić się słowo "Foundation"
       - address to obiekt z właściwościami street, city i country. miasto ma walidacje sprawdzającą
         czy jest jednym z kilku zapisanych w tablicy, użyj includes() na tablicy.
       - created - data dodania rekordu, domyślnie aktualny czas
       - volunteers - to tablica obiektów wolontariuszy. Każdy z obiektów posiada pola name,
                      surname, created oraz email (walidacja wymaga posiadania przez łańcuch @),
                      facebook (validacja wymaga aby adres zaczynał się z https://www.facebook.com)
       Pamiętaj aby do każdego pola dodać dokładny opis wymaganegu typu, czy jest required itd,
       do walidowanych pól dodaj również message mówiący jakie dane sa wymagane dla pola
    2. Napisz funkcję genRandVolunteer() która zwróci losowego wolontariusza jako obiekt
    3. Stwórz nową fundację o nazwie np: "Dev Foundation", podaj dowolny adres, a w tablicy zapisz
       minimum trzech wolontariuszy wykorzystując funkcję genRandVolunteer()
    4. Dokonaj validacji danych z użyciem validateSync(), pokaż zwrócone błędy dla nazwy fundacji
    5. Zrób walidację z wykorzystaniem metody validate() na instancji fundacji i pokaż ewentualne
       błędy w konsoli
    6. Skasuj wszystkie fundacje z bazy, zapisz utworzoną fundację do mongodb, w zwróconym
       rekordzie zmień miasto i zapisz ponownie rekord wykorzystując save()
*/
