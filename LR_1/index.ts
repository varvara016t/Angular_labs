/**
 * Интерфейс для представления данных об университете
 */
interface University {
    name: string;
    established: number;
    accredited: boolean;
    location: {
        city: string;
        address: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }
    };
    students: number;
    international_students: number;
    faculties: Faculty[];
    rankings: {
        national: number;
        international: number;
    };
    contacts: {
        phone: string;
        email: string;
        website: string;
    };
    facilities: {
        libraries: number;
        sports_complex: boolean;
        dormitories: number;
        canteens: number;
    };
    tuition_fees: {
        bachelor: {
            local_students: number;
            international_students: number;
        };
        master: {
            local_students: number;
            international_students: number;
        };
        currency: string;
    };
    has_online_courses: boolean;
    notable_alumni: string[];
}

/**
 * Интерфейс для представления данных о факультете
 */
interface Faculty {
    name: string;
    departments: string[];
    students_count: number;
    has_master_program: boolean;
}

/**
 * Функция загрузки данных из JSON файла с использованием XMLHttpRequest
 * @param url - путь к JSON файлу
 * @param successCallback - функция обратного вызова при успешной загрузке
 * @param errorCallback - функция обратного вызова при ошибке
 */
function loadData(
    url: string,
    successCallback: (data: University) => void,
    errorCallback: (error: string) => void
): void {
    // Создаем новый экземпляр XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    // Настраиваем обработчик события загрузки
    xhr.onload = function() {
        // Проверяем статус ответа
        if (xhr.status === 200) {
            try {
                // Парсим JSON-ответ
                const data: University = JSON.parse(xhr.responseText);
                successCallback(data);
            } catch (e) {
                // Если возникла ошибка при парсинге JSON
                errorCallback(`Ошибка при парсинге JSON: ${e}`);
            }
        } else {
            // Если статус не 200, значит произошла ошибка
            errorCallback(`Ошибка загрузки: ${xhr.status} ${xhr.statusText}`);
        }
    };
    
    // Настраиваем обработчик события ошибки
    xhr.onerror = function() {
        errorCallback("Сетевая ошибка при загрузке данных");
    };
    
    // Настраиваем обработчик события таймаута
    xhr.ontimeout = function() {
        errorCallback("Превышено время ожидания ответа");
    };
    
    // Открываем соединение
    xhr.open("GET", url, true);
    
    // Устанавливаем таймаут (5 секунд)
    xhr.timeout = 5000;
    
    // Отправляем запрос
    xhr.send();
}

/**
 * Функция для отображения данных об университете
 * @param data - данные об университете
 */
function displayUniversityData(data: University): void {
    const resultElement = document.getElementById("result") as HTMLElement;
    
    // Форматируем данные для отображения
    let output = `Информация об университете:\n`;
    output += `===============================\n`;
    output += `Название: ${data.name}\n`;
    output += `Год основания: ${data.established}\n`;
    output += `Аккредитован: ${data.accredited ? 'Да' : 'Нет'}\n`;
    output += `Расположение: ${data.location.city}, ${data.location.address}\n`;
    output += `Координаты: ${data.location.coordinates.latitude}, ${data.location.coordinates.longitude}\n\n`;
    
    output += `Количество студентов: ${data.students}\n`;
    output += `Иностранных студентов: ${data.international_students}\n\n`;
    
    output += `Факультеты:\n`;
    data.faculties.forEach((faculty, index) => {
        output += `  ${index + 1}. ${faculty.name}\n`;
        output += `     Кафедры: ${faculty.departments.join(', ')}\n`;
        output += `     Количество студентов: ${faculty.students_count}\n`;
        output += `     Программы магистратуры: ${faculty.has_master_program ? 'Есть' : 'Нет'}\n\n`;
    });
    
    output += `Рейтинги:\n`;
    output += `  Национальный: ${data.rankings.national}\n`;
    output += `  Международный: ${data.rankings.international}\n\n`;
    
    output += `Контакты:\n`;
    output += `  Телефон: ${data.contacts.phone}\n`;
    output += `  Email: ${data.contacts.email}\n`;
    output += `  Сайт: ${data.contacts.website}\n\n`;
    
    output += `Инфраструктура:\n`;
    output += `  Библиотеки: ${data.facilities.libraries}\n`;
    output += `  Спортивный комплекс: ${data.facilities.sports_complex ? 'Есть' : 'Нет'}\n`;
    output += `  Общежития: ${data.facilities.dormitories}\n`;
    output += `  Столовые: ${data.facilities.canteens}\n\n`;
    
    output += `Стоимость обучения (${data.tuition_fees.currency}):\n`;
    output += `  Бакалавриат:\n`;
    output += `    Местные студенты: ${data.tuition_fees.bachelor.local_students}\n`;
    output += `    Иностранные студенты: ${data.tuition_fees.bachelor.international_students}\n`;
    output += `  Магистратура:\n`;
    output += `    Местные студенты: ${data.tuition_fees.master.local_students}\n`;
    output += `    Иностранные студенты: ${data.tuition_fees.master.international_students}\n\n`;
    
    output += `Онлайн-курсы: ${data.has_online_courses ? 'Есть' : 'Нет'}\n\n`;
    
    output += `Известные выпускники:\n`;
    data.notable_alumni.forEach((alumnus, index) => {
        output += `  ${index + 1}. ${alumnus}\n`;
    });
    
    // Отображаем данные
    resultElement.textContent = output;
    resultElement.style.display = "block";
    
    // Также можно вывести данные в консоль для отладки
    console.log("Данные об университете:", data);
}

/**
 * Функция для отображения сообщения об ошибке
 * @param error - текст ошибки
 */
function displayError(error: string): void {
    const errorElement = document.getElementById("error-message") as HTMLElement;
    const resultElement = document.getElementById("result") as HTMLElement;
    
    errorElement.textContent = `Ошибка: ${error}`;
    resultElement.style.display = "none";
    
    // Также выводим ошибку в консоль
    console.error("Ошибка:", error);
}

// Обработчик события загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    // Получаем ссылки на кнопки
    const loadDataButton = document.getElementById("load-data") as HTMLButtonElement;
    const loadErrorButton = document.getElementById("load-error") as HTMLButtonElement;
    
    // Обработчик нажатия на кнопку "Загрузить данные"
    loadDataButton.addEventListener("click", () => {
        // Очищаем предыдущее сообщение об ошибке
        const errorElement = document.getElementById("error-message") as HTMLElement;
        errorElement.textContent = "";
        
        // Загружаем данные из файла
        loadData(
            "university.json",
            displayUniversityData,
            displayError
        );
    });
    
    // Обработчик нажатия на кнопку "Симулировать ошибку"
    loadErrorButton.addEventListener("click", () => {
        // Очищаем предыдущее сообщение об ошибке
        const errorElement = document.getElementById("error-message") as HTMLElement;
        errorElement.textContent = "";
        
        // Загружаем данные из несуществующего файла для симуляции ошибки
        loadData(
            "non_existent_file.json",
            displayUniversityData,
            displayError
        );
    });
});