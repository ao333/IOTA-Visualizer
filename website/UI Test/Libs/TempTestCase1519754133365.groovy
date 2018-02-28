import com.kms.katalon.core.main.TestCaseMain
import com.kms.katalon.core.logging.KeywordLogger
import groovy.lang.MissingPropertyException
import com.kms.katalon.core.testcase.TestCaseBinding
import com.kms.katalon.core.driver.internal.DriverCleanerCollector
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.webui.contribution.WebUiDriverCleaner
import com.kms.katalon.core.mobile.contribution.MobileDriverCleaner


DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.webui.contribution.WebUiDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.mobile.contribution.MobileDriverCleaner())


RunConfiguration.setExecutionSettingFile('C:\\Users\\Ao\\AppData\\Local\\Temp\\Katalon\\Test Cases\\1\\20180227_175533\\execution.properties')

TestCaseMain.beforeStart()
try {
    
        TestCaseMain.runTestCaseRawScript(
'''import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
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

not_run: WebUI.openBrowser('')

not_run: WebUI.navigateToUrl('http://51.140.113.215:3000/')

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/img'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Map'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_About'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Contact Us'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/a_Map'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/img_1'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/button__simple-switch-track'))

not_run: WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_handle'))

WebUI.doubleClick(findTestObject('Page_IOTA Node Visualizer/span_handle_1'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/button__simple-switch-track_1'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_handle_2'))

WebUI.doubleClick(findTestObject('Page_IOTA Node Visualizer/span_handle_3'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/button__simple-switch-track_2'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_handle_4'))

WebUI.doubleClick(findTestObject('Page_IOTA Node Visualizer/span_handle_5'))

WebUI.rightClick(findTestObject('Page_IOTA Node Visualizer/canvas'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_10023'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_59.91'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_10025'))

WebUI.rightClick(findTestObject('Page_IOTA Node Visualizer/span_0'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/span_0'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/div_Copyright 2017. IOTA group'))

WebUI.rightClick(findTestObject('Page_IOTA Node Visualizer/div_Placeholder      0'))

WebUI.click(findTestObject('Page_IOTA Node Visualizer/html_IOTA Node Visualizer'))

WebUI.closeBrowser()

''', 'Test Cases/1', new TestCaseBinding('Test Cases/1', [:]), FailureHandling.STOP_ON_FAILURE )
    
} catch (Exception e) {
    TestCaseMain.logError(e, 'Test Cases/1')
}
