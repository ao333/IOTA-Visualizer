import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('http://51.140.113.215:3000/')

WebUI.click(findTestObject('Page_IOTA Node Visualizer/img'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Map'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_About'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Contact Us'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Map'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_handle'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/div_limit to 4k'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/button__simple-switch-track'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/button__simple-switch-track_1'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/th_Hash'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/td_dongxiao huang'))

WebUI.doubleClick(findTestObject('Page_IOTA Node Visualizer/canvas'))

WebUI.doubleClick(findTestObject('Page_IOTA Node Visualizer/div_Total Tips      10027'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/body_Map'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.closeBrowser()

