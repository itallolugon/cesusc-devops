const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const app = require('../src/app');

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
}

async function testHomePage() {
  const server = app.listen(PORT);
  const driver = await buildDriver();

  try {
    await driver.get(BASE_URL + '/');
    await driver.wait(until.elementLocated(By.css('h1')), 5000);

    const h1 = await driver.findElement(By.css('h1')).getText();
    if (!h1.includes('Bem-vindo ao projeto Node.js do Cesusc DevOps!')) {
      throw new Error(`h1 inesperado: ${h1}`);
    }

    const title = await driver.getTitle();
    if (title !== 'Olá DevOps') {
      throw new Error(`title inesperado: ${title}`);
    }

    const p = await driver.findElement(By.css('p')).getText();
    if (!p.includes('Express')) {
      throw new Error(`paragrafo inesperado: ${p}`);
    }
  } finally {
    await driver.quit();
    await new Promise((resolve) => server.close(resolve));
  }
}

test('Regressao: pagina inicial da aplicacao', async () => {
  await testHomePage();
}, 60000);
