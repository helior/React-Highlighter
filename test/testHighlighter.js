var React = require('react');
var TestUtils = require('react-dom/test-utils');
var ReactDOM = require('react-dom');
var expect = require('chai').expect;
var Highlight = require('..');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = global.document.defaultView;

describe('Highlight element', function() {
  it('is what it says it is', function() {
    var element = React.createElement(Highlight, {search: 'world'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');

    expect(TestUtils.isElement(element)).to.be.true;
    expect(TestUtils.isElementOfType(element, Highlight)).to.be.true;
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('World');
  });

  it('should have children', function() {
    var element = React.createElement(Highlight, {search: 'fox'}, 'The quick brown fox jumped over the lazy dog.');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithClass(node, 'highlight');

    expect(ReactDOM.findDOMNode(node).children.length).to.equal(3);
    expect(matches).to.have.length(1);
  });

  it('should allow empty search', function() {
    var element = React.createElement(Highlight, {search: ''}, 'The quick brown fox jumped over the lazy dog.');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithClass(node, 'highlight');

    expect(ReactDOM.findDOMNode(node).children.length).to.equal(0);
    expect(matches).to.have.length(0);
  });

  it('should support custom HTML tag for matching elements', function() {
    var element = React.createElement(Highlight, {search: 'world', matchElement: 'em'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'em');
    expect(matches).to.have.length(1);
  });

  it('should support custom className for matching element', function() {
    var element = React.createElement(Highlight, {search: 'Seek', matchClass: 'fffffound'}, 'Hide and Seek');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithClass(node, 'fffffound');
    expect(matches).to.have.length(1);
  });

  it('should support custom style for matching element', function() {
    var element = React.createElement(Highlight, {search: 'Seek', matchStyle: { color: 'red' }}, 'Hide and Seek');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches[0].getAttribute('style')).to.eql('color: red;');
  });

  it('should support passing props to parent element', function() {
    var element = React.createElement(Highlight, {search: 'world', className: 'myHighlighter'}, 'Hello World');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');

    expect(ReactDOM.findDOMNode(node).className).to.equal('myHighlighter');
    expect(ReactDOM.findDOMNode(matches[0]).className).to.equal('highlight')
  });

  it('should support case sensitive searches', function() {
    var element = React.createElement(Highlight, {search: 'TEST', caseSensitive: true}, 'test Test TeSt TEST');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(1);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('TEST');
  });

  it('should support matching diacritics exactly', function() {
    var text = 'Café has a weird e. Cafééééé has five of them. Cafe has a normal e. Cafeeeee has five of them.';
    var element = React.createElement(Highlight, {search: 'Cafe'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(2);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Cafe');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Cafe');

    var element = React.createElement(Highlight, {search: 'Café'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(2);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Café');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Café');
  });

  it('should support ignoring diacritics', function() {
    var text = 'Café has a weird e. Cafééééé has five of them. Cafe has a normal e. Cafeeeee has five of them.';
    var element = React.createElement(Highlight, {search: 'Cafe', ignoreDiacritics: true}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(4);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Café');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Café');
    expect(ReactDOM.findDOMNode(matches[2]).textContent).to.equal('Cafe');
    expect(ReactDOM.findDOMNode(matches[3]).textContent).to.equal('Cafe');
  });

  it('should support regular expressions in search', function() {
    var element = React.createElement(Highlight, {search: /[A-Za-z]+/}, 'Easy as 123, ABC...');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Easy');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('as');
    expect(ReactDOM.findDOMNode(matches[2]).textContent).to.equal('ABC');
  });

  it('should work when regular expressions in search do not match anything', function() {
    var element = React.createElement(Highlight, {search: /z+/}, 'Easy as 123, ABC...');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(0);
  });

  it('should support regular expressions with the global parameter', function() {
    var element = React.createElement(Highlight, {search: /brown|fox/g}, 'The quick brown fox jumped over the lazy dog.');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('brown');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('fox');
  });

  it('should stop immediately if regex matches an empty string', function() {
    var element = React.createElement(Highlight, {search: /z*/}, 'Ez as 123, ABC...');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(0);

    var element = React.createElement(Highlight, {search: /z*/}, 'zzz Ez as 123, ABC...');
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(1);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('zzz');
  });

  it('should support matching diacritics exactly with regex', function() {
    var text = 'Café has a weird e. Cafééééé has five of them. Cafe has a normal e. Cafeeeee has five of them.';
    var element = React.createElement(Highlight, {search: /Cafe/}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(2);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Cafe');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Cafe');

    var element = React.createElement(Highlight, {search: /Café/}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(2);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Café');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Café');
  });

  it('should support ignoring diacritics with regex', function() {
    var text = 'Café has a weird e. Cafééééé has five of them. Cafe has a normal e. Cafeeeee has five of them.';
    var element = React.createElement(Highlight, {search: /Cafe+/, ignoreDiacritics: true}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(4);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Café');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Cafééééé');
    expect(ReactDOM.findDOMNode(matches[2]).textContent).to.equal('Cafe');
    expect(ReactDOM.findDOMNode(matches[3]).textContent).to.equal('Cafeeeee');
  });

  it('should support ignoring diacritics with blacklist', function() {
    var text = 'Letter ä is a normal letter here: Ääkkösiä';
    var element = React.createElement(Highlight, {search: 'Aakkosia', ignoreDiacritics: true, diacriticsBlacklist: 'Ää'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(0);

    var element = React.createElement(Highlight, {search: 'Ääkkösiä', ignoreDiacritics: true, diacriticsBlacklist: 'Ää'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(1);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('Ääkkösiä');
  });

  it('should support ignoring diacritics with blacklist with regex', function() {
    var text = 'Letter ä is a normal letter here: Ääkkösiä';
    var element = React.createElement(Highlight, {search: /k+o/i, ignoreDiacritics: true, diacriticsBlacklist: 'Ää'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(1);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('kkö');

    var element = React.createElement(Highlight, {search: /ä+/i, ignoreDiacritics: true, diacriticsBlacklist: 'Ää'}, text);
    var node = TestUtils.renderIntoDocument(element);
    var matches = TestUtils.scryRenderedDOMComponentsWithTag(node, 'mark');
    expect(matches).to.have.length(3);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).to.equal('ä');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).to.equal('Ää');
    expect(ReactDOM.findDOMNode(matches[2]).textContent).to.equal('ä');
  });

  it('should support escaping arbitrary string in search', function() {
    var element = React.createElement(Highlight, {search: 'Test ('}, 'Test (should not throw)');
    expect(TestUtils.renderIntoDocument.bind(TestUtils, element)).to.not.throw(Error);
  });

  it('should not throw on long strings', function() {
    var longString = 'The quick brown fox jumped over the lazy dog. ';
    for (var i = 0; i < 4; i++) {
      longString += longString;
    }
    var element = React.createElement(Highlight, {search: /([A-Za-z])+/}, longString);
    expect(TestUtils.renderIntoDocument.bind(TestUtils, element)).not.to.throw(Error);
  });
});
