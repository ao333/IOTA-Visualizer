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


RunConfiguration.setExecutionSettingFile('C:\\Users\\Ao\\AppData\\Local\\Temp\\Katalon\\Test Cases\\1\\20180227_174408\\execution.properties')

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

not_run: WebUI.click(findTestObject('Index/img'))

not_run: WebUI.click(findTestObject('Index/a_Map'))

not_run: WebUI.click(findTestObject('Index/a_About'))

not_run: WebUI.click(findTestObject('Index/a_Contact Us'))

not_run: WebUI.click(findTestObject('Index/a_Map'))

not_run: WebUI.click(findTestObject('Index/div_Transaction'))

WebUI.rightClick(findTestObject('Index/div_Transaction'))

WebUI.click(findTestObject('Index/button__simple-switch-track'))

WebUI.click(findTestObject('Index/span_handle'))

WebUI.doubleClick(findTestObject('Index/span_handle_1'))

WebUI.click(findTestObject('Index/button__simple-switch-track_1'))

WebUI.click(findTestObject('Index/span_handle_2'))

WebUI.doubleClick(findTestObject('Index/span_handle_3'))

WebUI.click(findTestObject('Index/button__simple-switch-track_2'))

WebUI.click(findTestObject('Index/span_handle_4'))

WebUI.doubleClick(findTestObject('Index/span_handle_5'))

WebUI.click(findTestObject('Index/html_IOTA Node Visualizer'))

WebUI.click(findTestObject('Index/span_10022'))

WebUI.click(findTestObject('Index/span_10022'))

WebUI.click(findTestObject('Index/span_59.91'))

WebUI.click(findTestObject('Index/span_0'))

WebUI.click(findTestObject('Index/html_IOTA Node Visualizer     _1'))

WebUI.click(findTestObject('Index/th_Hash'))

WebUI.click(findTestObject('Index/body_Map'))

WebUI.click(findTestObject('Index/p_Copyright 2017. IOTA group p'))

WebUI.doubleClick(findTestObject('Index/canvas'))

WebUI.doubleClick(findTestObject('Index/canvas'))

WebUI.doubleClick(findTestObject('Index/a_Map'))

WebUI.click(findTestObject('Index/html_IOTA Node Visualizer     _2'))

WebUI.rightClick(findTestObject('Index/canvas'))

WebUI.closeBrowser()

WebUI.verifyElementAttributeValue(findTestObject(null), '', '', 0)

''', 'Test Cases/1', new TestCaseBinding('Test Cases/1', [:]), FailureHandling.STOP_ON_FAILURE )
    
} catch (Exception e) {
    TestCaseMain.logError(e, 'Test Cases/1')
}
