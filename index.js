const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'], // Launch browser in full-screen mode
    });
    const page = await browser.newPage();

    // Set the viewport size to full HD or desired resolution
    await page.setViewport({ width: 1920, height: 1080 });

    const UrlApi = 'https://www.amazon.com/s?k=pc+monitor&i=black-friday&crid=2ZSQ75YJJ7HEJ&sprefix=pc%2Cblack-friday%2C1461&ref=nb_sb_ss_ts-doa-p_3_2';
    await page.goto(UrlApi);

    await page.screenshot({path:'amazong.png'})

    const bookDetails = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.s-card-container');
        const books = [];

        for (const product of productElements) {
            const title = product.querySelector('h2 > a')?.innerText.trim() || null;
            const price = product.querySelector('.a-price .a-offscreen')?.innerText.trim() || null;
            const rating = product.querySelector('span[aria-label]')?.getAttribute('aria-label') || null;

            if (title) {
                books.push({ title, price, rating });
            }
        }

        return books;
    });

    console.log(bookDetails);

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(bookDetails);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
    xlsx.writeFile(workbook, 'Amazon.xlsx');

    console.log('Data saved as Excel: Amazon.xlsx');
    await browser.close();
})();
