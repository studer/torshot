import tornado.web
import tornado.ioloop
import tornado.gen
import tornado.escape
from io import BytesIO
#from PIL import Image
from datetime import datetime
from selenium import webdriver

class ScreenHandler(tornado.web.RequestHandler):
    @tornado.gen.coroutine
    def get(self, url):
        try:
            driver = webdriver.PhantomJS(service_args=['--proxy-type=socks5', '--proxy=127.0.0.1:9050', '--local-url-access=false'])
            driver.set_window_size(1024, 768)
            driver.set_page_load_timeout(30)
            driver.get(url)
            base64 = driver.get_screenshot_as_base64()
            #screenshot = Image.open(BytesIO(driver.get_screenshot_as_png()))
            #screenshot = screenshot.crop((0,0,1024,768))
            driver.quit()
            self.write(tornado.escape.json_encode([{'status':'OK', 'base64':base64}]))
            self.set_header('Content-Type', 'application/json')
        except:
            self.write(tornado.escape.json_encode([{'status':'ERROR'}]))
            self.set_header('Content-Type', 'application/json')


def make_app():
    handler = [
            (r'/torshot/(.*)', ScreenHandler),
            (r'/(.*)', tornado.web.StaticFileHandler, {'path': 'template'}),
        ]
    settings = dict(
            template_path="template",
            static_path="template",
            debug=True,
        )
    return tornado.web.Application(handler, **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
