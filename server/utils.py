from rich.console import Console
from rich.style import Style
from rich.text import Text

console = Console()


def consoleLog(info: str, type: str) -> None:
    match type:
        case 'success':
            defaultStyle = Style(color='green', bold=True)
        case 'log':
            defaultStyle = Style(color='white', italic=True)
        case 'fail':
            defaultStyle = Style(color='red', bold=True)
        case 'test':
            defaultStyle = Style(color='yellow', bold=True)
    text = Text(info, style=defaultStyle)
    console.print(text)
